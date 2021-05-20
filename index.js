const fetch = require('node-fetch')

function addNewImport(endpoint) {
  return function (args) {
    fetch(`${this.site}/wp-json/wp/v2/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        ...args,
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
  }
}

const wpImporter = {
  site: '',
  token: '',
  createInstance: async function (args) {
    const { site, login, password } = args
    await fetch(`${site}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        username: login,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        this.site = site
        this.token = res.token
      })
    return this
  },

  addCategory: addNewImport('categories'),
}

module.exports = wpImporter
