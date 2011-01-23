//renderer.js

/*

it = require('it-is')
it(null).ok()
*/

var render = require('render')
  , log = require('logger')
  , trees = require('trees/trees')
//  , style = require('./style').ascii

function pathTo(obj,path){
  for(var i in path)
    obj = obj[i]
  return obj
}

module.exports = {
  ok: function (error,style){
    return style.render(style.red(error.actual),'',style.red('ok'))
  }
, instanceof: function (error,style){
    return style.render 
      ( style.red (style.stringify(error.actual))
      , style.green (error.expected.name)
      , style.red('instanceof') )
  }
, every : function (error,style){
    var m = [] //error.every instanceof Array ? [] : {}
      , found = false
    if(error.index === -1) //if every is given an empty list or the wrong parameters
      return style.render
        ( style.red(style.stringify(error.every))
        , error.message
        , 'every' )
    
    function value(v,k,o){
      if(i == error.index){
        found = true
        return render.Special(style.red(style.stringify(v)))
      } else if (!found)
        return render.Special(style.green(style.stringify(v)))
      else  
        return render.Special(style.yellow(style.stringify(v)))
    }
    for(var i in error.every){
        m[i] = value(error.every[i],i,error.every)
    }

/*    var op = '{',cl = '}'
      if (error.every instanceof Array)
        op = '[',cl = ']'*/
        


    return style.render(style.stringify(m),error.message,style.red('every'))
  }
/*"it({ a: 1, b: !false! }).!has!({ a: it.typeof("number"), b: it(!false!).!ok!() })"
"it({ a: 1, b: !false! }).has({ a: it.typeof("number"), b: it(!false!).!ok!() })")*/

, has: function (error,style){
    var props = trees.copy(error.props)
      , object = trees.copy(error.object)
      , parentPath = trees.copy(error.path)
      , key = parentPath.pop()
      , value = pathTo(error.object,parentPath)[key]
      
    pathTo(props,parentPath)[key] = render.Special(error.message) //Special makes render not stringify (no ""'s)
    pathTo(object,parentPath)[key] = render.Special(style.red(value))

    //also, need propper indentation so it's readable.
    //and make red() configurable, so it can term-colour, or ascii only.
    //shift render code out into another module 

    return style.render
      ( style.stringify(object)
      , style.stringify(props)
      , style.red('has') )
    //render has, and it but replace the error causing item in has with the error message.
  }
, default: function (error,style,name){
    return style.render
      ( style.red (style.stringify(error.actual))
      , style.green (style.stringify(error.expected))
      , style.red (name) )
  }
}

