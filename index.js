
var position = require('position')
  , query = require('query')
  , Slider = require('slider')

module.exports = function (editor, el) {
  var slider = new Slider({scale: .1})
    , range = null
    , changing = false
  function change(number) {
    console.log('gotchange', number, range)
    if (!range) return
    var r = editor.getSelectionRange()
      , s = editor.getSelection()
      , txt = number + ''
    changing = true
    r.setStart(range.row, range.start)
    r.setEnd(range.row, range.end)
    try {
      console.log('set', r, txt, range)
      s.setRange(r)
      editor.insert(txt)
    } catch (e) {
      console.log('failed!', e, range, txt, number)
    }
    changing = false
    range.end = range.start + txt.length
  }
  slider.on('change', change)
  editor.getSession().selection.on('changeSelection', function (e) {
    if (changing) return
    var r = editor.getSelectionRange()
      , pos = r.start
      , num
    if (!r.isEmpty()) {
      range = null
      try {
        slider.hide()
      } catch (e) {}
      return
    }
    try {
      num = editor.getNumberAt(pos.row, pos.column)
    } catch (e) {
      range = null
      try {
        slider.hide()
      } catch (e) {}
      return
    }
    if (!num) {
      range = null
      try {
        slider.hide()
      } catch (e) {}
      return
    }
    console.log('got number', num)
    var cursor = query('.ace_cursor', el)
    range = {row: pos.row, start: num.start, end: num.end}
    slider.set(parseInt(num.value, 10), true)
    slider.show(cursor)
    console.log('change', this, e)
  })
}
