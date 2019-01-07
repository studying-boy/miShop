<template>
    <div>
        <asideList></asideList>
        <div class="goodList">
            <el-container>
                <el-main>
                    <el-table :data="goodList" height="700" :row-class-name="tableRowClassName">
                        <el-table-column prop="_id" label="ID" width="300" class="warning">
                        </el-table-column>
                        <el-table-column label="商品名称" width="180">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.editFlag">{{ scope.row.name }}</span>
                                <span v-if="scope.row.editFlag" class="cell-edit-input">
                                <el-input v-model="scope.row.name"></el-input>
                            </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="现价" width="80" sortable>
                            <template slot-scope="scope">
                                <span v-if="!scope.row.editFlag">{{ scope.row.price }}</span>
                                <span v-if="scope.row.editFlag" class="cell-edit-input">
                                <el-input v-model="scope.row.price"></el-input>
                            </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="原价" width="80">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.editFlag">{{ scope.row.oldPrice }}</span>
                                <span v-if="scope.row.editFlag" class="cell-edit-input">
                                <el-input v-model="scope.row.oldPrice"></el-input>
                            </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="库存">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.editFlag">{{ scope.row.number }}</span>
                                <span v-if="scope.row.editFlag" class="cell-edit-input">
                                <el-input v-model="scope.row.number"></el-input>
                            </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="分类">
                            <template slot-scope="scope">
                            <span v-if="!scope.row.editFlag">
                                <el-select  placeholder="请选择" filterable v-model="scope.row.classify_id" disabled>
                                    <el-option
                                        v-for="item in options"
                                        :key="item._id"
                                        :label="item.name"
                                        :value="item._id">
                                    </el-option>
                                </el-select>
                            </span>
                                <span v-if="scope.row.editFlag" class="cell-edit-input">
                                <el-select  placeholder="请选择" filterable v-model="scope.row.classify_id">
                                    <el-option
                                        v-for="item in options"
                                        :key="item._id"
                                        :label="item.name"
                                        :value="item._id">
                                    </el-option>
                                </el-select>
                            </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="!scope.row.editFlag"
                                    @click.native.prevent="editRow(scope.$index, goodList)"
                                    type="text"
                                    size="small">
                                    编辑
                                </el-button>
                                <el-button
                                    v-if="!scope.row.editFlag"
                                    @click.native.prevent="deleteRow(scope.$index, goodList)"
                                    type="text"
                                    size="small">
                                    移除
                                </el-button>
                                <el-button
                                    v-if="scope.row.editFlag"
                                    @click.native.prevent="saveRow(scope.$index, goodList)"
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
    import asideList from "@/components/asideList/asideList.vue";
    export default{
        data() {
            return {
                goodList:[],
                editFlag:false,   //判断是否进入了编辑模式
                tempData:{},
                options:[]     //分类
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
                //获取所有商品信息
                this.$http.get("/api/management/getGoodList").then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        that.goodList = res.result;
                    }
                });
                //获取分类
                this.$http.get("/api/management/getClassify").then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        this.options = res.result;
                        console.log(this.options);
                    }
                });
            },
            //根据商品所存库存来改变不同的颜色
            tableRowClassName(row) {
                console.log(row.row.number);
                if (row.row.number < 0) {
                    return 'error'
                }else if(row.row.number < 10) {
                    return 'warning'
                }else {
                    return ''
                }
            },
            deleteRow(index, rows) {                      //删除某一行数据
                let that = this;
                this.$confirm('确定要删除此条数据吗？', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$http.post("/api/management/delGood",{
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
                this.tempData = rows[index];
                this.$set(rows[index],"editFlag",true);
            },
            saveRow(index, rows){                         //保存某一行数据
                rows[index].editFlag = false;
                for(let key in rows[index]){
                    console.log(key + " " + this.tempData[key]);
                    /*if(rows[index][key] == null || rows[index][key] == ""){
                        console.log(key + " " + rows[index][key]);
                        rows[index][key] = this.tempData[key];
                    }*/
                }
                console.log(this.tempData["oldPrice"]);
                this.$http.post("/api/management/saveGood",{
                    id: rows[index]._id,
                    obj : rows[index]
                });
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .goodList{
        width:calc(100% - 200px);
        float: left;
        .el-container{
            .el-header{
                padding-left:0;
            }
            .el-main{
                padding:0;
                .el-table-column{
                    flex:1;

                }
                .error{
                    background: rgba(255,0,0,0.7);
                }
                .warning{
                    background: rgba(255,255,0,0.7);
                }
            }
        }
    }
</style>
