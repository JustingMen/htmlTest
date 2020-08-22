class Compiler {
  constructor( el, vm ) {
    this.el = el.nodeType === 1 ? el : document.querySelector( el );
    this.vm = vm;

    // 将模板 DOM 保存在 虚拟 DOM 碎片中
    let fragment = this.node2Fragment( this.el );
    console.log( fragment );
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