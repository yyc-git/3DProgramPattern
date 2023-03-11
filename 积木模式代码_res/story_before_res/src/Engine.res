type directorAPI = {
  init: unit => unit,
  loop: unit => unit,
}

let directorAPI: directorAPI = {
  init: Director.init,
  loop: Director.loop,
}
