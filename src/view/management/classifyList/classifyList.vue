<template>
    <div>
        <asideList></asideList>
        <div class="classifyList">
            <el-container>
                <el-main>
                    <el-table :data="classifyList" height="700" >
                        <el-table-column prop="_id" label="ID" width="300">
                        </el-table-column>
                        <el-table-column label="商品名称" width="180">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.editFlag">{{ scope.row.name }}</span>
                                <span v-if="scope.row.editFlag" class="cell-edit-input">
                                <el-input v-model="scope.row.name"></el-input>
                            </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="!scope.row.editFlag"
                                    @click.native.prevent="editRow(scope.$index, classifyList)"
                                    type="text"
                                    size="small">
                                    编辑
                                </el-button>
                                <el-button
                                    v-if="!scope.row.editFlag"
                                    @click.native.prevent="deleteRow(scope.$index, classifyList)"
                                    type="text"
                                    size="small">
                                    移除
                                </el-button>
                                <el-button
                                    v-if="scope.row.editFlag"
                                    @click.native.prevent="saveRow(scope.$index, classifyList)"
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
                classifyList:[],
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
                this.$http.get("/api/management/getClassify").then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        that.classifyList = res.result;
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
                    that.$http.post("/api/management/delClassify",{
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
                this.$http.post("/api/management/saveClassify",{
                    id: rows[index]._id,
                    classifyName : rows[index].name
                });
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .classifyList{
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
            }
        }
    }
</style>
