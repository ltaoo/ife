/* jquery 的事件监听机制
 */

/**
 * 注册事件
 */
function bind (node, eventName, callback) {
    node.addEventListener(eventName, callback)
}

/**
 * 事件委托
 */
function delegate (parent, child, eventName, callback) {
    parent.addEventListener(eventName, function (event) {
        var target = event.target
        // 父容器下的子元素
        var children = [].slice.call(document.querySelectorAll(child, parent))
        if (children.indexOf(target) > -1) {
            callback(event)
        }
    })
}
// function delegate (elem, selector, types, handler, data) {
//     var handleobjin, eventhandle, tmp,
//         events, t, handleObj,
//         special, handlers, type, namespaces, origType,
//         elemData = dataPriv.get( elem );

//     // Don't attach events to noData or text/comment nodes (but allow plain objects)
//     if ( !elemData ) {
//         return;
//     }

//     // Caller can pass in an object of custom data in lieu of the handler
//     if ( handler.handler ) {
//         handleObjIn = handler;
//         handler = handleObjIn.handler;
//         selector = handleObjIn.selector;
//     }

//     // Ensure that invalid selectors throw exceptions at attach time
//     // Evaluate against documentElement in case elem is a non-element node (e.g., document)
//     if ( selector ) {
//         jQuery.find.matchesSelector( documentElement, selector );
//     }

//     // Make sure that the handler has a unique ID, used to find/remove it later
//     if ( !handler.guid ) {
//         handler.guid = jQuery.guid++;
//     }

//     // Init the element's event structure and main handler, if this is the first
//     if ( !( events = elemData.events ) ) {
//         events = elemData.events = {};
//     }
//     if ( !( eventHandle = elemData.handle ) ) {
//         eventHandle = elemData.handle = function( e ) {

//             // Discard the second event of a jQuery.event.trigger() and
//             // when an event is called after a page has unloaded
//             return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
//                 jQuery.event.dispatch.apply( elem, arguments ) : undefined;
//         };
//     }

//     // Handle multiple events separated by a space
//     types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
//     t = types.length;
//     while ( t-- ) {
//         tmp = rtypenamespace.exec( types[ t ] ) || [];
//         type = origType = tmp[ 1 ];
//         namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

//         // There *must* be a type, no attaching namespace-only handlers
//         if ( !type ) {
//             continue;
//         }

//         // If event changes its type, use the special event handlers for the changed type
//         special = jQuery.event.special[ type ] || {};

//         // If selector defined, determine special event api type, otherwise given type
//         type = ( selector ? special.delegateType : special.bindType ) || type;

//         // Update special based on newly reset type
//         special = jQuery.event.special[ type ] || {};

//         // handleObj is passed to all event handlers
//         handleObj = jQuery.extend( {
//             type: type,
//             origType: origType,
//             data: data,
//             handler: handler,
//             guid: handler.guid,
//             selector: selector,
//             needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
//             namespace: namespaces.join( "." )
//         }, handleObjIn );

//         // Init the event handler queue if we're the first
//         if ( !( handlers = events[ type ] ) ) {
//             handlers = events[ type ] = [];
//             handlers.delegateCount = 0;

//             // Only use addEventListener if the special events handler returns false
//             if ( !special.setup ||
//                 special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

//                 if ( elem.addEventListener ) {
//                     elem.addEventListener( type, eventHandle );
//                 }
//             }
//         }

//         if ( special.add ) {
//             special.add.call( elem, handleObj );

//             if ( !handleObj.handler.guid ) {
//                 handleObj.handler.guid = handler.guid;
//             }
//         }

//         // Add to the element's handler list, delegates in front
//         if ( selector ) {
//             handlers.splice( handlers.delegateCount++, 0, handleObj );
//         } else {
//             handlers.push( handleObj );
//         }

//         // Keep track of which events have ever been used, for event optimization
//         jQuery.event.global[ type ] = true;
//     }

// }