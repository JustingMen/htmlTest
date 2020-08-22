class Compiler {
  constructor( el, vm ) {
    this.el = el.nodeType === 1 ? el : document.querySelector( el );
    this.vm = vm;

    // 将模板 DOM 保存在 虚拟 DOM 碎片中
    let fragment = this.node2Fragment( this.el );

    // 编译 虚拟 DOM 碎片中的 自定义的 v- 指令
    this.compiler( fragment );

    //将 编译好的 虚拟 DOM 挂在到 DOM元素
    this.el.appendChild( fragment );
    
  }

  node2Fragment ( node ) {
    
    // 创建一个虚拟 DOM 碎片，用来存放 模板DOM 节点
    let fragment = document.createDocumentFragment();
    let firstChild = null;

    //将模板 DOM 中的所有元素放入虚拟 DOM 碎片中
    while( firstChild = node.firstChild ) {
      fragment.appendChild( firstChild );
    }

    return fragment;
  }

  compiler( node ) {
    //获取 虚拟 DOM 碎片中的所有 子节点
    let childNodes = node.childNodes;

    [ ...childNodes ].forEach( child => {
      
      //如果是 元素节点
      if( child.nodeType === 1 ) {
        //调用相应的处理函数
        this.compilerAttr( child, this.vm );
      } else {
        //如果是 文本节点  则调用相应的处理函数
        this.compilerText( child, this.vm );
      }

      // 如果 子元素中还存在子元素，则递归调用 compiler 方法
      if( child.childNodes && child.childNodes.length ) {
        this.compiler( child );
      }
    })
  }

  compilerAttr( node, vm ) {

    // 自定义指令的前缀 ‘v-’
    let vBefore = 'v-';

    // 获取 元素的所有属性
    let attributes = node.attributes;

    // 遍历所有 元素属性 并调用相应的方法
    [ ...attributes ].forEach( attr => {

      let { name, value } = attr;
      
      if( name.includes( vBefore ) ) {

        let [ , dirText ] = String.prototype.split.call( name, '-' );
        let [ dirName, eventName] = String.prototype.split.call( dirText, ':' );

        compilerUtil[dirName]( node, value, vm, eventName );
      }
    })
  }

  compilerText( child, vm ) {

    let content = child.textContent;
    let mus = /\{\{(.+?)\}\}/;

    if( mus.test( content )) {
      compilerUtil['text']( child, content, vm );
    }
  }

}

let compilerUtil = {
  getVal: function( expr, vm ) {

    let rMus = /\{\{(.+?)\}\}/g;
    let value = null;

    if( expr.includes( '{{' ) ) {
      
      value = expr.replace( rMus, ( ...attr ) => {
        return attr[1].split('.').reduce( ( data, currentVal ) => {
          return data[ currentVal.trim() ];
        }, vm.$data );
      });
    } else {
      value = expr.split('.').reduce( ( data, currentVal ) => {
        return data[ currentVal ];
      }, vm.$data );
    }

    return value;
  },
  text: function( node, expr, vm ) {
    let value = this.getVal( expr, vm );
    node.textContent = value;
  },
  html: function( node, expr, vm ) {
    let value = this.getVal( expr, vm );
    node.innerHTML = value;
  },
  model: function( node, expr, vm ) {
    let value = this.getVal( expr, vm );
    node.value = value;
  },
  on: function( node, expr, vm ) {
    
  }
}

class myVue {
  constructor( options ) {
    this.$el = options.el;
    this.$data = options.data;

    if( this.$el ) {

      //编译元素中的自定义标签
      new Compiler( this.$el, this );
    }
  }
}