class Compiler {
  constructor( el, vm ) {
    this.el = el.nodeType === 1 ? el : document.querySelector( el );
    this.vm = vm;

    // 将模板 DOM 保存在 虚拟 DOM 碎片中
    let fragment = this.node2Fragment( this.el );

    // 编译 虚拟 DOM 碎片中的 自定义的 v- 指令
    this.compiler( fragment );
    
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