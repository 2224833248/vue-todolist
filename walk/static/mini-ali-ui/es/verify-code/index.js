import fmtEvent from '../_util/fmtEvent';
Component({
  props: {
    className: '',
    labelCls: '',
    label: '验证码',
    inputCls: '',
    last: false,
    value: '',
    name: '',
    type: 'text',
    password: false,
    placeholder: '请输入验证码',
    placeholderClass: '',
    placeholderStyle: '',
    disabled: false,
    maxlength: 140,
    focus: false,
    clear: true,
    // 默认有清除功能
    syncInput: false,
    enableNative: false,
    // 兼容安卓input的输入bug
    countDown: 60,
    isInitialActive: true,
    onInput: function onInput() {},
    onConfirm: function onConfirm() {},
    onFocus: function onFocus() {},
    onBlur: function onBlur() {},
    onClear: function onClear() {},
    onSend: function onSend() {}
  },
  data: {
    _focus: false,
    _actionActive: true,
    _countDown: 60,
    resent: false
  },
  didMount: function didMount() {
    this.setData({
      _focus: this.props.focus,
      _actionActive: this.props.isInitialActive,
      _countDown: this.props.countDown,
      actedBefore: false
    });
  },
  didUnmount: function didUnmount() {
    clearInterval(this._timeout);
  },
  methods: {
    onBlur: function onBlur(e) {
      this.setData({
        _focus: false
      });
      var event = fmtEvent(this.props, e);
      this.props.onBlur(event);
    },
    onConfirm: function onConfirm(e) {
      var event = fmtEvent(this.props, e);
      this.props.onConfirm(event);
    },
    onFocus: function onFocus(e) {
      this.setData({
        _focus: true
      });
      var event = fmtEvent(this.props, e);
      this.props.onFocus(event);
    },
    onInput: function onInput(e) {
      var event = fmtEvent(this.props, e);
      this.props.onInput(event);
    },
    onClear: function onClear(e) {
      var event = fmtEvent(this.props, e);
      this.props.onClear(event);
    },
    onTapSend: function onTapSend(e) {
      var _this = this;

      var _this$props = this.props,
          countDown = _this$props.countDown,
          onSend = _this$props.onSend;

      if (this.data._actionActive) {
        this.setData({
          _actionActive: false
        });
        this._timeout = setInterval(function () {
          var subOne = _this.data._countDown - 1;

          if (subOne <= 0) {
            clearInterval(_this._timeout);

            _this.setData({
              _actionActive: true,
              resend: true,
              _countDown: countDown,
              actedBefore: true
            });
          } else {
            _this.setData({
              _countDown: subOne
            });
          }
        }, 1000);
        var event = fmtEvent(this.props, e);
        onSend(event);
      }
    }
  }
});