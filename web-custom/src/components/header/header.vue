<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{sellerName}}</span>
        </div>
        <div class="description">
          {{username}}
          <!-- {{seller.description}} / {{seller.deliveryTime}}分钟送达 -->
        </div>
        <!-- <div class="support" v-if="seller.supports">
            <span class="icon" :class="classMap[seller.supports[0].type]">
            </span>
            <span class="text">
              {{seller.supports[0].description}}
            </span>
        </div>-->
      </div>
      <!-- <div v-if="seller.supports" class="support-count" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
      </div>-->
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{sellerName}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title" v-if="0">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports&&0" class="supports">
              <li class="support-item" v-for="item,$index in seller.supports">
                <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
                <span class="text">{{seller.supports[$index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="closeDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import star from "components/star/star";
import { mapState } from "vuex";
import { sjinfo } from "@/api/user";
export default {
  props: {
    seller: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      username: state => state.userName
    })
  },
  data() {
    return {
      sellerName: "",
      bulletin: "",
      detailShow: false,
      avatar: require("../../common/images/logo.png")
    };
  },
  methods: {
    showDetail() {
      this.detailShow = true;
    },
    closeDetail() {
      this.detailShow = false;
    },
    getInfo() {
      sjinfo().then(res => {
        if (res.data.code == 1) {
          this.sellerName = res.data.data.name;
          this.bulletin = res.data.data.announcement;
        }
      });
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
    console.log(this.$route);
  },
  mounted() {
    this.getInfo();
  },
  components: {
    star
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin';
@import '../../common/stylus/base';

.header {
  position: relative;
  color: #fff;
  background: rgba(7, 17, 27, 0.5);
  overflow: hidden;

  .content-wrapper {
    position: relative;
    padding: 24px 12px 18px 24px;
    font-size: 0;

    .avatar {
      display: inline-block;
      vertical-align: top;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;

      img {
        border-radius: 2px;
      }
    }

    .content {
      display: inline-block;
      margin-left: 16px;

      .title {
        margin: 2px 0 8px 0;

        .brand {
          display: inline-block;
          vertical-align: top;
          width: 30px;
          height: 18px;
          bg-image('brand');
          background-size: 30px 18px;
          background-repeat: no-repeat;
        }

        .name {
          margin-left: 6px;
          font-size: 16px;
          line-height: 18px;
          font-weight: bold;
        }
      }

      .description {
        line-height: 32px;
        font-size: 18px;
      }

      .support {
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 4px;
          background-size: 12px 12px;
          background-repeat: no-repeat;

          &.decrease {
            bg-image('decrease_1');
          }

          &.discount {
            bg-image('discount_1');
          }

          &.guarantee {
            bg-image('guarantee_1');
          }

          &.invoice {
            bg-image('invoice_1');
          }

          &.special {
            bg-image('special_1');
          }
        }

        .text {
          line-height: 12px;
          font-size: 10px;
        }
      }
    }

    .support-count {
      position: absolute;
      right: 12px;
      bottom: 18px;
      padding: 0 8px;
      height: 24px;
      line-height: 24px;
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.2);
      text-align: center;
      cursor: pointer;

      .count {
        font-size: 10px;
      }

      .icon-keyboard_arrow_right {
        font-size: 10px;
        line-height: 24px;
        margin-left: 2px;
      }
    }
  }

  .bulletin-wrapper {
    position: relative;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    padding: 0 22px 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(7, 17, 27, 0.2);

    .bulletin-title {
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
      width: 22px;
      height: 12px;
      bg-image('bulletin');
      background-size: 22px 12px;
      background-repeat: no-repeat;
    }

    .bulletin-text {
      vertical-align: top;
      margin: 0 4px;
      font-size: 10px;
    }

    .icon-keyboard_arrow_right {
      position: absolute;
      font-size: 10px;
      right: 12px;
      top: 9px;
    }
  }

  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
    filter: blur(10px);
  }

  .detail {
    position: fixed;
    z-index: 100;
    width: 100%;
    height: 100%;
    overflow: auto;
    left: 0;
    top: 0;
    transition: 0.5s all ease;
    background: rgba(7, 17, 27, 0.8);
    backdrop-filter: blur(10px);

    &.fade-leave, &.fade-enter-active {
      opacity: 1;
    }

    &.fade-enter, &.fade-leave-active {
      opacity: 0;
    }

    .detail-wrapper {
      width: 100%;
      min-height: 100%;

      .detail-main {
        margin-top: 64px;
        padding-bottom: 64px;

        .name {
          line-height: 16px;
          font-size: 16px;
          text-align: center;
          font-weight: 700;
        }

        .star-wrapper {
          text-align: center;
          margin-top: 18px;
          padding: 2px 0;
        }

        .title {
          display: flex;
          width: 80%;
          margin: 30px auto 24px auto;

          .line {
            flex: 1;
            position: relative;
            top: -6px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }

          .text {
            padding: 0 12px;
            font-size: 14px;
          }
        }

        .supports {
          width: 80%;
          margin: 0 auto;

          .support-item {
            padding: 0 12px;
            margin-bottom: 12px;
            font-size: 0;

            &:last-child {
              margin-bottom: 0;
            }

            .icon {
              display: inline-block;
              width: 16px;
              height: 16px;
              vertical-align: top;
              margin-right: 6px;
              background-size: 16px 16px;
              background-repeat: no-repeat;

              &.decrease {
                bg-image('decrease_2');
              }

              &.discount {
                bg-image('discount_2');
              }

              &.guarantee {
                bg-image('guarantee_2');
              }

              &.invoice {
                bg-image('invoice_2');
              }

              &.special {
                bg-image('special_2');
              }
            }

            .text {
              font-size: 12px;
              line-height: 16px;
            }
          }
        }

        .bulletin {
          width: 80%;
          margin: 0 auto;

          .content {
            padding: 0 12px;
            line-height: 24px;
            font-size: 12px;
            overflow: auto;
          }
        }
      }
    }

    .detail-close {
      position: relative;
      width: 32px;
      height: 32px;
      line-height: 64px;
      margin: -64px auto 0 auto;
      clear: both;
      font-size: 32px;
    }
  }
}
</style>
