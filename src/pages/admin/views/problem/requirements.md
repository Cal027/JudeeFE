- [ ] 来源 input

- [ ] 语言选择（多选）

- [ ] 测试样例数及对应分数，默认分数为0，现有的score不需要 score应该为所有样例的总分，设想是一个“+” 点一下多一行输入框可以填该样例分数，（至少需要填一个样例）samples也一样

- [ ] 最好点击添加题目后再跳转到是否上传样例文件的地方，因为这时候才有题目id

- [ ] 如果有上传文件那么后端会检查文件中的样例数和填写的是否对应，如不对应则删除已上传的样例，并要求重新上传或取消

- [ ] 作者那一栏可以删

- [ ] 把form字段改成如下：

  is_public: true/false,

  title: '',

  description:'',

  input_description:'',

  output_description:'',

  samples:[{

  ​	input:'',

  ​	output:''

  }],

  test_case_score:[0,0,...],

  hint:'',

  languages:['java','cpp'],

  time_limit:0,

  memory_limit:0,

  difficulty:可以直接传文字也可以传数字来代表等级,

  source:代表题目来源可为空,

  created_by: username
