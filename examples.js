var it = require('it-is') //defaults to colour

exports = module.exports = 
  {
   'numbers': function (){
      it(10000).equal(10001)
    },
   'strings': function (){
      it('check string equality').equal('check string smameness')
    },
   'like (case/whitespace insensitive)': function (){
      it('check STRING like').like('check\n string\n like S ')
    },
   '{} instanceof Array': function (){
      it({}).instanceof(Array)
    },
   'function x(){} is primitive ': function (){
      it(function x(){}).primitive()
    },
   'every one of 1,2,3,\'X\',4 is a number': function (){
      it([1,2,3,'X',4]).every(it.typeof('number'))
    },
   'object {a: {b: 1}, z: 2} has .a.b which is equal to 10': function (){
      it({a: {b: 1}, z: 2}).has({a: {b: it.equal(10) } })
    },
   'object {a: {b: 1}, z: 2} has .a.b which is equal to 10': function (){
      it({a: 1, b: {} }).has( {b:{c: {} } } )
    }
  }



    

if(require.main == module)
  for (var i in exports){
    Error.stackTraceLimit = 1
    try{
      exports[i]()
    } catch (error){
      console.log('~',i)
      console.log()
      console.log(error.stack)
      console.log()
    }
  }


