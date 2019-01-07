<template>
    <div>
        <asideList></asideList>
        <div class="orderList">
            <el-container>
                <el-main>
                    <el-table :data="orderList" height="700" >
                        <!--每条信息隐藏的内容-->
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="购买商品" v-for="(item,key) in props.row.goods" :key="key">
                                        <span>{{ item.name }}  {{item.count}}份</span>
                                    </el-form-item>
                                    <el-form-item label="收货人">
                                        <span>{{ props.row.address.name }}</span>
                                    </el-form-item>
                                    <el-form-item label="电话">
                                        <span>{{ props.row.address.tel }}</span>
                                    </el-form-item>
                                    <el-form-item label="收货地址">
                                        <span>{{ props.row.address.province }}{{ props.row.address.city }}{{ props.row.address.county }}{{ props.row.address.address_detail }}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>


                        <el-table-column prop="_id" label="ID" width="300">
                        </el-table-column>
                        <el-table-column label="状态" width="180">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.editFlag">{{ scope.row.status }}</span>
                                <span v-if="scope.row.editFlag" class="cell-edit-input">
                                    <el-input v-model="scope.row.status"></el-input>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_at" label="创建时间" width="200">
                        </el-table-column>
                        <el-table-column prop="totalPrice" label="总价" width="200">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="!scope.row.editFlag"
                                    @click.native.prevent="editRow(scope.$index, orderList)"
                                    type="text"
                                    size="small">
                                    编辑
                                </el-button>
                                <el-button
                                    v-if="!scope.row.editFlag"
                                    @click.native.prevent="deleteRow(scope.$index, orderList)"
                                    type="text"
                                    size="small">
                                    移除
                                </el-button>
                                <el-button
                                    v-if="scope.row.editFlag"
                                    @click.native.prevent="saveRow(scope.$index, orderList)"
                                    type="text"
                                    size="small">
                                    保存
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </div>
    </div>

</template>

<script>
    import asideList from "@/components/asideList/asideList.vue"
    export default{
        data() {
            return {
                orderList:[],
                editFlag:false
            }
        },
        components:{
            asideList
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                let that = this;
                this.$http.get("/api/management/getOrderList").then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        that.orderList = res.result;
                        for(var i in that.orderList){
                            if(that.orderList[i].status == "1"){
                                that.orderList[i].status = "待付款";
                            }else if(that.orderList[i].status == "2"){
                                that.orderList[i].status = "待出库";
                            }else if(that.orderList[i].status == "3"){
                                that.orderList[i].status = "已完成";
                            }
                        }
                        console.log("success");
                    }
                });
            },
            deleteRow(index, rows) {                      //删除某一行数据
                let that = this;
                this.$confirm('确定要删除此条数据吗？', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$http.post("/api/management/delOrder",{
                        id:rows[index]._id
                    }).then((response)=>{
                        let res = response.data;
                        if(res.status === "0"){
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            rows.splice(index, 1);
                        }
                    });
                })
            },
            editRow(index, rows){                         //编辑某一行数据
                this.$set(rows[index],"editFlag",true);
            },
            saveRow(index, rows){                         //保存某一行数据
                rows[index].editFlag = false;
                console.log(rows[index]._id);
                this.$http.post("/api/management/saveOrder",{
                    id: rows[index]._id,
                    status:rows[index].status
                });
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .orderList{
        width:calc(100% - 200px);
        float: left;
        .el-container{
            .el-header{
                padding-left:0;
            }
            .el-main{
                padding:0;
                .demo-table-expand {
                    font-size: 0;
                }
                .demo-table-expand label {
                    width: 90px;
                    color: #99a9bf;
                }
                .demo-table-expand .el-form-item {
                    margin-right: 0;
                    margin-bottom: 0;
                    width: 50%;
                }
                .el-table-column{
                    flex:1;
                }
            }
        }
    }
</style>
