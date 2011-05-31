#Render#

get complete control* of how your objects are turned into text.

* well, not exactly "complete", turns out this is a *hard* problem.

#Default#

    render(object,options)

options is a {} of functions which overwrite the default way to stringify each part of the object.

see `render.js` and `test/*.js` for examples

#Customize Rendering#

these functions are:

    value // display a primitive value
    key // display a key (on an object, but not an array)
    join // join a list object key->value strings into one string (default joins with ','s
    surround // puts the brackets on {} or [] 
    referenced // when a object is repeated later (default: varX={...})
    reference // when a object is a repeat (varX

    string // stringify string (useful if you want to handle multi line strings a special way
    
#Renderer function args#

    function(value, traverserProperties, default)
    
`value` is the item to be renderer,
`traverserProperties` if information about current place in the tree/graph 
(see https://github.com/dominictarr/traverser)
`default` is the default rendering function for this item.

#Layout Control#

also, padding around certain items can be changed by setting the following values of options:

    indent: '' //indentation applied to each line after the first when something renders to a string with multiple lines.
    , joiner: ', ' // string to join arrays and objects
    , pad: '' 
    , padKey: ' ' //padding after the ':'
    , padSingle: ['', ''] //padding around a single value
    , padJoin: [' ', ' '] //padding around a join (but inside the brackets)
    , padMulti: ['', ''] //padding around an object or Array when it goes over multiple lines
    , padRoot: ['', ''] //padding around the root object (only applied if it's multi lined)
    
examples, by adjusting these settings you can display an object in many different styles:


this object:

    var renderme = 
        { key1: value
        , key2: value
        , child: 
          { key1: value
          , key2: value } }

indented with comma first
    
    render(renderme,{joiner:"\n, ", indent: '  '})

    { key1: 1
    , key2: 2
    , child: { key1: 3
      , key2: 4 } }

indented, comma-first, object-newline

    render(renderme,{joiner:"\n, ", indent: '  ', padMulti: ['\n','']})

    { key1: 1
    , key2: 2
    , child: 
      { key1: 3
      , key2: 4 } }

indented, comma-first, bracket-ownline, cl-bracket-trailing

    render(renderme,{joiner:"\n, ", indent: '  ', padJoin: ['\n  ',' ']}

    {
      key1: 1
    , key2: 2
    , child: {
        key1: 3
      , key2: 4 } }

indented, comma-first, bracket-newline, cl-bracket-newline

    render(renderme,{joiner:"\n, ", indent: '  ', padJoin: ['\n  ','\n']}

    {
      key1: 1
    , key2: 2
    , child: {
        key1: 3
      , key2: 4
      }
    }

indented, comma-trailing, bracket-newline, cl-bracket-newline

    render(renderme,{joiner:",\n  ", indent: '  ', padJoin: ['\n  ','\n']}

    {
      key1: 1,
      key2: 2,
      child: {
        key1: 3,
        key2: 4
      }
    }

