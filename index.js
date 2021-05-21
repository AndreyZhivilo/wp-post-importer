const fetch = require('node-fetch')

async function createInstance(args) {
  const { site, login, password } = args
  let token = ''
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
      token = res.token
    })
  return { token, site }
}

function wpImporter(args) {
  const { site, token } = args

  const headers = {
    'Content-Type': 'application/json',
    accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }

  function importItem(args, endpoint) {
    fetch(`${site}/wp-json/wp/v2/${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        ...args,
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
  }

  function createImport(endpoint) {
    return function (args) {
      importItem(args, endpoint)
    }
  }

  function deleteItem(id, endpoint) {
    fetch(`${site}/wp-json/wp/v2/${endpoint}/${id}?force=true`, {
      method: 'DELETE',
      headers: headers,
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
  }

  function deleteAllItems(endpoint) {
    fetch(`${site}/wp-json/wp/v2/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const ids = res.reduce((a, element) => (a = [...a, element.id]), [])
        ids.forEach((element) => {
          deleteItem(element, endpoint)
        })
      })
  }

  function createDeletion(endpoint) {
    return function (id) {
      deleteItem(id, endpoint)
    }
  }

  return {
    ...args,
    addPost: createImport('posts'),
    addTag: createImport('tags'),
    addCategory: createImport('categories'),
    addCustomItem: importItem,
    deleteCustomItem: deleteItem,
    deletePost: createDeletion('posts'),
    deleteTag: createDeletion('tags'),
    deleteCategory: createDeletion('categories'),
    deleteAllCustom: deleteAllItems,
    deleteAllCategories: deleteAllItems('categories'),
    deleteAllPosts: deleteAllItems('posts'),
  }
}

module.exports = { wpImporter, createInstance }
