var style = require('style')
  , render = require('render')

function indent(string){
  return string.split('\n').map(function (e){return '  ' + e}).join('\n')
}

var ascii = {
     red: function (value) { return '!' + value + '!' } //is in error
,  green: function (value) { return value } //is okay
,  yellow: function (value) { return value } //was not checked.
}

var colour = {
  render: function (actual,expected,name){
    return 'it(' + actual + ').' + name + '(' + expected + ')'
  }
,    red: function (value) { return '' + style(value).red} //is in error
,  green: function (value) { return '' + style(value).green } //is okay
,  yellow: function (value) { return '' + style(value).yellow } //was not checked.
, stringify: function (value) { 
  return render 
    ( value
    , { joiner:",\n  "
      , indent: '  '
      , padJoin: ['\n  ','\n']
      , string: function (value,p,def){
        if(value.length < 20)
          return JSON.stringify(value)
        else
          return '\n' + indent(JSON.stringify(value)) + '\n'
       // return '[\n' + value.split('\n').map(function (e){return JSON.stringify(e)}).join(',\n  ') + '].join(\"\n\")'
      }
    } ) 
  }
}

ascii.__proto__ = colour

exports.ascii = ascii
exports.colour = colour

