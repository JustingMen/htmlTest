class Compiler {
  constructor( node, vm ) {
    this.el = node.nodeType === 1 ? el : document.querySelector( el );
    this.vm = vm;

    let fragment = this.node2Fragment( this.el );
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