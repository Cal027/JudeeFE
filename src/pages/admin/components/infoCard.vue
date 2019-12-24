<template>
    <el-card :body-style="{padding: 0, height: '100%'}" class="info-card">
        <el-row type="flex" class="info-card-container">
            <el-col :span="16" class="info-card-text">
                <p :style="textStyle">{{value>=0? value: 'N/A'}}</p>
                <p>{{message}}</p>
            </el-col>
            <el-col :span="8" class="height-100">
                <i :class="['info-card-icon', 'fa', `fa-${icon}`]" :style="{'font-size': iconSize}"/>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
export default {
  name: 'inforCard',
  props: {
    value: [String, Number],
    color: String,
    message: String,
    icon: String,
    iconSize: {
      type: String,
      default: '40px'
    },
    countSize: {
      type: String,
      default: '36px'
    },
    countWeight: {
      type: Number,
      default: 700
    }
  },
  computed: {
    textStyle () {
      return {
        'font-size': this.countSize,
        'font-weight': this.countWeight,
        color: this.color
      }
    }
  }
}
</script>

<style lang="less" scoped>
    @card-height: 110px;
    .height-100 {
        height: 100%;
    }

    .info-card {
        display: inline-block;
        margin-right: 10px;
        /*width: 300px;*/
        width: 100%;
        height: @card-height;
        text-align: center;
        vertical-align: middle;

        &-container {
            height: 100%;
            align-items: center;
            justify-content: center;
        }

        &-icon {
            line-height: @card-height;
            color: #4C566A;
        }

        &-text {
            p {
                margin: 2px;
                font-weight: 500;
                font-size: 20px;
            }
        }
    }
</style>
