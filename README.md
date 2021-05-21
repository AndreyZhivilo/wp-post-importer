# What is this?

This library makes easyer interactions with Wordpress REST API. You can create or delete posts, custom post types, tags, categories or custom taxonomies.

# Installation

`npm install wp-post-importer`

Then...

```
;(async function () {
  const connection = await createInstance({
    site: 'http://wp-site.com',
    login: 'admin',
    password: 'root',
  })

  const newImport = new wpImporter(connection)

  const post = {
      title: 'Post #1',
      content: 'Post content',
      slug: 'post-1',
      status: 'publish'
  }

  const posts = [
    {
      title: 'Post #2',
      content: 'Post content',
      slug: 'post-2',
      status: 'publish',
    },
    {
      title: 'Post #3',
      slug: 'post-3',
      content: 'Post content',
      status: 'publish',
    },
  ]

  await newImport.addPost(post)

  posts.forEach(async (element) => await newImport.addPost(element))

})()

```

# What else?

### Creation

- Create new Category - `newImport.addCategory(args)`
- Create new Tag - `newImport.addTag(args)`
- Add custom post type or taxonomy - `newImport.addCustomItem(args, endpoint)`

### Deletion

- Delete Post - `newImport.deletePost(id)`
- Delete Category - `newImport.deleteCategory(id)`
- Delete Tag - `newImport.deleteTag(id)`
- Delete custom post type or taxonomy - `newImport.deleteCustomItem(id, endpoint)`
- Delete all Posts - `newImport.deleteAllPosts()`
- Delete all Categories - `newImport.deleteAllCategories()`
- Delete all items of certain endpoint - `newImport.deleteAllCustom(endpoint)`
