<template>
  <div>
    <!--    其他-->
    <div style="margin-top: 10px">
      <el-card>
        <el-row :gutter="10">
          <!--          分类-->
          <el-col :span="4">
            <div style="border: 1px dashed #ccc; text-align: center; border-bottom: none">
              <div class="category-item" @click="getGoodsByCategory(item.id)" v-for="item in categories" :key="item.id"
                   :class="{ active: (activeIndex === item.id)}">{{item.name }}
              </div>
            </div>
          </el-col>

          <el-col :span="20">
            <!--          分类商品-->
            <div style="min-height: 150px">
              <el-row :gutter="10">
                <el-col :span="6" v-for="item in tableData" :key="item.id">
                  <div style="margin-bottom: 10px; cursor: pointer"  @click="goodsDetail(item.id)">
                    <div style="padding: 5px"><el-image :src="item.imgs[0]" style="width: 100%; height: 100px" fit="contain"></el-image></div>
                    <div style="padding: 5px; height: 20px; text-align: center; font-size: 12px; overflow: hidden">
                      <el-tooltip :content="item.name" placement="bottom" effect="light">
                        <span class="item-title">{{ item.name }}</span>
                      </el-tooltip>
                    </div>
                    <div style="padding: 5px; text-align: center; color: red; font-size: 12px">
                      ￥ {{ item.price }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>

            <!--      分页-->
            <div style="margin-top: 20px">
              <el-pagination
                  small
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pageNum"
                  :page-size="pageSize"
                  :page-sizes="[4, 8, 12]"
                  layout=" prev, pager, next"
                  :total="total"
              >
              </el-pagination>
            </div>

          </el-col>
        </el-row>
      </el-card>

    </div>


    <div style="margin-top: 10px">
      <el-row :gutter="10">
        <!--    推荐商品-->
        <el-col :span="18">
          <el-card>
            <div style="padding: 10px 0; border-bottom: 2px solid orangered; font-size: 20px; color: orangered">推荐商品</div>
            <div style="padding: 10px 0">
              <el-row :gutter="10">
                <el-col :span="6" v-for="item in recommend" :key="item.id" style="margin-bottom: 10px">
                  <div style="border: 1px solid #ccc; cursor: pointer; padding: 10px"  @click="goodsDetail(item.id)">
                    <el-image :src="item.imgs[0]" style="width: 100%; height: 100px" fit="contain"></el-image>
                    <div style="padding: 5px; height: 20px; text-align: center; font-size: 12px; overflow: hidden">
                      <el-tooltip :content="item.name" placement="bottom" effect="light">
                        <span class="item-title">{{ item.name }}</span>
                      </el-tooltip>
                    </div>
                    <div style="padding: 5px; text-align: center; color: red; font-size: 12px">
                      ￥ {{ item.price }}
                    </div>
                  </div>

                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>

<!--        销售排行-->
        <el-col :span="6">
          <el-card>
            <div style="padding: 10px 0; border-bottom: 2px solid dodgerblue; font-size: 20px; color: dodgerblue">销量排行榜</div>

            <div style="padding: 10px 0">
              <el-row v-for="(item, index) in sales" :key="item.id">
                <div style="padding: 10px 0; cursor: pointer;" @click="goodsDetail(item.id)">
                  <el-col :span="2" style="padding-top: 5px">
                    <span v-if="index === 0" style="color: gold">{{ index + 1 }}</span>
                    <span v-if="index === 1" style="color: silver">{{ index + 1 }}</span>
                    <span v-if="index === 2" style="color: coral">{{ index + 1 }}</span>
                    <span v-if="index > 2">{{ index + 1 }}</span>
                  </el-col>
                  <el-col :span="10"><el-image :src="item.imgs[0]" style="width: 100%; height: 80px" fit="contain"></el-image></el-col>
                  <el-col :span="12">
                    <div style="overflow: hidden; height: 80px; font-size: 12px">
                      {{ item.description }}
                    </div>
                  </el-col>
                </div>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </div>

  </div>
</template>

<script>
import API from "@/utils/request";

const url = "/api/video/"

export default {
  name: "Home",
  data() {
    return {
      sales: [],
      recommend: [],
      tableData: [],
      activeIndex: 0,
      imgList: [],
      user: {},
      categories: [],
      pageNum: 1,
      pageSize: 8,
      total: 0
    };
  },
  created() {
    this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
    this.load()
  },
  methods: {
    goodsDetail(id) {
      this.$router.replace({path: '/front/goods', query: {id: id}})
    },
    getGoodsByCategory(id) {
      this.activeIndex = id
      this.loadTable(id)
    },
    load() {
      API.get("/api/goods/recommend").then(res => {
        this.recommend = res.data

        this.recommend.forEach(item => {
          // 处理下表格的图片显示
          if (!item.imgs) {
            item.imgs = ['']
          } else {
            item.imgs = JSON.parse(item.imgs)
          }
        })
      })

      API.get("/api/goods/sales").then(res => {
        this.sales = res.data

        this.sales.forEach(item => {
          // 处理下表格的图片显示
          if (!item.imgs) {
            item.imgs = ['']
          } else {
            item.imgs = JSON.parse(item.imgs)
          }
        })
      })

      API.get("/api/category").then(res => {
        this.categories = res.data
        this.activeIndex = res.data[0].id
        this.loadTable(res.data[0].id)
      })
    },
    loadTable(categoryId) {
      API.get("/api/goods/byCategory/" + categoryId, {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total

        this.tableData.forEach(item => {
          // 处理下表格的图片显示
          if (!item.imgs) {
            item.imgs = ['']
          } else {
            item.imgs = JSON.parse(item.imgs)
          }
        })
      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.loadTable(this.categories[0].id)
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.loadTable(this.categories[0].id)
    }
  },
};
</script>

<style scoped>
.active {
  color: red !important;
}

.category-item {
  padding: 5px 0;
  border-bottom: 1px dashed #ccc;
  color: #666;
  cursor: pointer;
}

.line1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-title {
  cursor: pointer;
}
.item-title:hover {
  color: orangered;
}
</style>
