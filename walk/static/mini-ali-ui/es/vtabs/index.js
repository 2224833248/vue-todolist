import fmtUnit from '../_util/fmtUnit';
Component({
  data: {
    tabTop: 0,
    wrapScrollTop: 0,
    besideRadius: fmtUnit('8px')
  },
  props: {
    activeTab: 0,
    className: '',
    tabs: [],
    animated: false,
    swipeable: true,
    tabBarActiveTextColor: '#1677FF',
    tabBarInactiveTextColor: '#333333',
    tabBarActiveBgColor: '#ffffff',
    tabBarInactiveBgColor: '#f5f5f5',
    tabBarlineColor: '#1677FF',
    sameFontSize: true,
    tabBarlineShow: true,
    onTabClick: function onTabClick() {},
    onScrollBar: function onScrollBar() {}
  },
  didMount: function didMount() {
    this.isScrolling = false;
    this.timerId = null;
    this.calcHeight();
  },
  didUpdate: function didUpdate(prevProps) {
    var activeTab = this.props.activeTab;

    if (this.props.tabs.length !== prevProps.tabs.length || activeTab !== prevProps.activeTab) {
      this.calcHeight();
    }
  },
  didUnmount: function didUnmount() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  },
  methods: {
    calcHeight: function calcHeight() {
      var _this = this;

      var _this$props = this.props,
          tabs = _this$props.tabs,
          activeTab = _this$props.activeTab;
      this.anchorMap = {};
      this.indexMap = {};
      this.wrapHeight = 0;
      this.scrollWrapHeight = 0;
      my.createSelectorQuery().select(".am-vtabs-slides-" + this.$id).boundingClientRect().exec(function (ret) {
        _this.wrapHeight = ret[0].height;
      });
      var cacheHeight = 0;

      var _loop = function _loop(i) {
        var anchor = tabs[i].anchor;
        /* eslint-disable no-loop-func */

        my.createSelectorQuery().select("#am-vtab-slide-" + anchor).boundingClientRect().exec(function (ret) {
          _this.anchorMap[anchor] = cacheHeight;
          _this.indexMap[i] = cacheHeight;

          if (activeTab === i) {
            _this.setData({
              wrapScrollTop: _this.indexMap[i]
            });
          }

          cacheHeight += ret[0].height;
          _this.scrollWrapHeight = cacheHeight;
        });
      };

      for (var i = 0; i < tabs.length; i++) {
        _loop(i);
      }
    },
    handleTabClick: function handleTabClick(e) {
      var _e$target$dataset = e.target.dataset,
          anchor = _e$target$dataset.anchor,
          index = _e$target$dataset.index;

      if (!this.isScrolling || !this.props.swipeable) {
        if (this.props.activeTab !== index) {
          this.props.onTabClick(index);
        }

        this.setData({
          wrapScrollTop: this.anchorMap[anchor]
        });
        this.moveScrollBar(index);
      }
    },
    moveScrollBar: function moveScrollBar(current) {
      var tabTop;

      if (current < 6) {
        tabTop = 0;
      } else {
        tabTop = (current - 5) * 55;
      }

      if (this.props.activeTab !== current) {
        if (this.props.onChange) {
          this.props.onChange(current);
        } else {
          this.props.onScrollBar(current);
        }
      }

      this.setData({
        tabTop: tabTop,
        current: current,
        currentBefore: current - 1,
        currentAfter: current + 1
      });
    },
    onScroll: function onScroll(e) {
      var _this2 = this;

      var scrollTop = e.detail.scrollTop;
      var keys = Object.keys(this.anchorMap);

      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }

      this.timerId = setTimeout(function () {
        _this2.isScrolling = false;
      }, 300);
      var anchorLength = keys.length;

      for (var i = 0; i < anchorLength; i++) {
        if (i === anchorLength - 1) {
          // 如果是最后一个只需满足scrollTop高于当前vtab-content的高度
          if (scrollTop >= this.anchorMap[keys[i]]) {
            this.moveScrollBar(i);
            break;
          }
        }

        if (scrollTop >= Math.floor(this.anchorMap[keys[i]]) && scrollTop < Math.floor(this.anchorMap[keys[i + 1]])) {
          // 如果没个vtab-content高度小于scroll-view高度，到达底部后就不需要根据scrollTop再去判断左侧的选择项
          if (scrollTop + this.wrapHeight < this.scrollWrapHeight) {
            this.moveScrollBar(i);
          }

          break;
        }
      }
    },
    onWrapTouchMove: function onWrapTouchMove() {
      if (this.props.swipeable) {
        this.isScrolling = true;
      }
    },
    onTabFirstShow: function onTabFirstShow(e) {
      // SDKversion 最低要求 1.9.4
      var _e$target$dataset2 = e.target.dataset,
          index = _e$target$dataset2.index,
          anchor = _e$target$dataset2.anchor;

      if (this.props.onTabFirstShow) {
        this.props.onTabFirstShow({
          index: index,
          anchor: anchor
        });
      }
    }
  }
});