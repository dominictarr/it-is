var assert = require('c-assert')
  , asserters = require('./assert')
  , log = require('logger')
  , inspect = require('inspect')
  , render = require('render/render2')
module.exports = It

function merge(a,b){
  var ary = [a]
  for(i in b){
    ary.push(b[i])
  }
  return ary
}

function It(obj){
  if(!(this instanceof It))
    return new It(obj)

  this.obj = obj
  this.assertion = function (name,func,args){
    func.apply(null,merge(this.obj,args))
    return this
  }
}


var asserts = It.__proto__ = It.prototype = {}

//add all the standard assert methods.

for(i in asserters) {
  asserts[i] = asserter(asserters[i],i)
}

function asserter(func,name){
  return function (){
    return this.assertion(name,func,arguments)  
  }
}
// when you set the prototype of a function you loose 
// apply and call, 
function fakeFunction (proto){ 
  var fake =
  { apply: function (self,args){
      Function.apply.apply(this,[self,args])
    }  
  , call: function (){
      Function.call.apply(this,arguments)
    }
  }
  fake.__proto__ = proto
  return fake
}


It.assertion = function (name,func,args){
  var assertions = [[func,args,name]]
    , self = AssertionList

   AssertionList.assertion = function (name,func,args){
     assertions.push([func,args,name])
     return AssertionList
   } 

  AssertionList.__proto__ = fakeFunction(asserts)
  AssertionList.toString = function (){
      var r =  "it" + assertions.map(function (e){
        return '.' + e[2] + '(' + renderArgs(e[1]) + ')'
      }).join('')
      log('toString() ==',r)
      return r
  }

  return AssertionList

  function AssertionList (actual) {
    assertions.forEach(function (assertion){
      //log('call assertion list:',actual,assertion[1])
      assertion[0].apply(null,merge(actual,assertion[1]))
    })
  }
}
function renderIt(i){
return render(i, {value: function (v,p,def){
      if(v .name == 'AssertionList')
        return v.toString()
      return def(v,p)
    } } )
}
function renderArgs(args){
  var l = []
  for(i in args){
//   return 'asdfsdgadsgsdfgvdsc'
   l.push(renderIt(args[i]))
//    l.push(args[i].name == 'AssertionList' ? args[i].toString() : )
  }
  return l.join('\n ,')
}
