'use strict'

const Sequelize = require('sequelize')
const { Op } = Sequelize
const fs = require('fs')

module.exports = class Storage {
  constructor () {
    const storage = process.env.ENVIRONMENT === 'development' ? './database.sqlite' : '.data/database.sqlite'

    this.sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
      host: '0.0.0.0',
      dialect: 'sqlite',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      storage
    })

    this.sequelize.authenticate()
      .then((err) => {
        console.log('Connection has been established successfully.')

        this.User = this.sequelize.define('user', {
          id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
          },
          hidden: {
            defaultValue: false,
            type: Sequelize.BOOLEAN
          },
          displayName: {
            type: Sequelize.STRING,
          },
          twitterID: {
            type: Sequelize.STRING,
            unique: true
          },
          username: {
            type: Sequelize.STRING,
            unique: true
          },
          profileImage: {
            type: Sequelize.STRING
          }
        })

        this.Location = this.sequelize.define('location', {
          id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
          },
          name: {
            type: Sequelize.STRING
          },
          approved: {
            defaultValue: false,
            type: Sequelize.BOOLEAN
          },
          description: {
            type: Sequelize.STRING
          },
          lng: {
            type: Sequelize.STRING
          },
          lat: {
            type: Sequelize.STRING
          },
          address: {
            type: Sequelize.STRING
          }
        })

        this.User.hasMany(this.Location)
        this.Location.belongsTo(this.User)

        this.User.sync()
        this.Location.sync()
      })
      .catch(function (err) {
        console.log('Unable to connect to the database: ', err)
      })
  }

  recreateDatabase () {
    this.User.sync({ force: true })
    this.Location.sync({ force: true })
  }

  createLocation ({ userId, lng, lat, name, description, address, approved }) {
    return this.Location.create({ userId, lng, lat, name, description, address, approved })
  }

  rejectLocation ({ id }) {
    return this.Location.findOne({ 
      where: { id } 
    }).then((location) => {
      return location.update({ approved: false })
    })
  }

  approveLocation ({ id }) {
    return this.Location.findOne({ 
      where: { id } 
    }).then((location) => {
      return location.update({ approved: true })
    })
  }

  removeLocation ({ id }) {
    return this.Location.destroy({ 
      where: { id }
    })
  }

  getPublicLocations () {
    let where =  { approved: true }

    let include = {
      model: this.User,
      as: 'user'
    }

    return this.Location.findAll({
      order: [['updatedAt', 'DESC']],
      where,
      include
    })
  }
  getLocations ({ moderated, admin, username = undefined }) {
    let where
    let include = [{
      model: this.User
    }]

    if (admin === username) {
      where = {}
    } else {

      if (moderated) {

        if (username) {
          include = {
            model: this.User,
            as: 'user'
          }

          where = { 
            [Op.or]: [
              {'$user.username$': username },
              { approved: true },
            ]
          }

        } else {
          where = { approved: true }
        } 

      } else {
          where = undefined
      }
    }

    return this.Location.findAll({
      order: [['updatedAt', 'DESC']],
      where,
      include
    })
  }

  findOrCreate ({ twitterID, username, displayName, profileImage }) {
    return this.User.findOne({ where: { twitterID } })
      .then((user) => {
        if (!user) {
          return this.User.create({ twitterID, username, displayName, profileImage })
        } 
        return user
      })
  }
}
