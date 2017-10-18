function randomNumber(max, start=0) {
  return Math.floor(Math.random()* max) + start
}

function randomizedArray (arr) {
  var rIndex
  var arrCopy = arr.slice()
  var tmpArr = []
  for (var i = 0; i < arr.length; i++) {
    rIndex = Math.floor(Math.random() * arrCopy.length)
    tmpArr.push(arrCopy.splice(rIndex, 1)[0])
  }
  // console.log(tmpArr)
  return tmpArr
}