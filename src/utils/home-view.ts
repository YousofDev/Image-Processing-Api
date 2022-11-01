const homeView = `<h1>Welcome to Image Processing API</h1>
  <h3>Show an image by filename</h3>
  <ul><li><a href="/api/images?filename=coffin">/api/images?filename=coffin</a></li></ul>
  <h3>Resize an image by filename, width, height</h3>
  <ul><li><a href="/api/images?filename=coffin&width=700&height=700">
  /api/images?filename=coffin&width=700&height=700</a></li></ul>
  <h3>Available Filenames</h3>
  <ul>
  <li>coffin<li/><li>carol<li/><li>luxor<li/><li>museum<li/><li>palace<li/>
  </ul>
`
export default homeView
