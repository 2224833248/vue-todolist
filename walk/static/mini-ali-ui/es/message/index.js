import fmtEvent from '../_util/fmtEvent';
var SUPPORT_COMPONENT2 = my.canIUse('component2');
var TYPE_MAP = {
  success: 'check_',
  fail: 'close_',
  cancel: 'close_',
  info: 'help_',
  warn: 'warn_',
  waiting: 'time-5_'
};
Component({
  props: {
    className: '',
    type: 'success',
    title: '',
    onTapMain: function onTapMain() {},
    onTapSub: function onTapSub() {}
  },
  data: {
    iconType: 'check_'
  },
  onInit: function onInit() {
    this.setType(this.props.type);
  },
  didMount: function didMount() {
    if (!SUPPORT_COMPONENT2) {
      this.setType(this.props.type);
    }
  },
  didUpdate: function didUpdate(prevProps) {
    if (!SUPPORT_COMPONENT2 && this.props.type !== prevProps.type) {
      this.setType(this.props.type);
    }
  },
  deriveDataFromProps: function deriveDataFromProps(nextProps) {
    if (this.props.type !== nextProps.type) {
      this.setType(nextProps.type);
    }
  },
  methods: {
    tapMain: function tapMain(e) {
      var event = fmtEvent(this.props, e);
      this.props.onTapMain(event);
    },
    tapSub: function tapSub(e) {
      var event = fmtEvent(this.props, e);
      this.props.onTapSub(event);
    },
    setType: function setType(type) {
      var realType = TYPE_MAP[type] || 'check_';
      this.setData({
        iconType: realType
      });
    }
  }
});