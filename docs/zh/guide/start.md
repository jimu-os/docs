---
layout: doc
---

# 快速入门

## 创建 table

创建一张 `student` 表，用于测试

```sql
create table student
(
    id          int auto_increment primary key,
    name        varchar(20) null,
    age         int         null,
    create_time datetime    null
);
```

## 创建 映射模型

根据数据库表，或者sql查询结果集 创建一个结构体用于接收查询数据，`column` 属性的值对应者 sql 表定义的列名

```go
// Student 用户模型
type Student struct {
	Id         int    `column:"id"json:"id,omitempty"`
	Name       string `column:"name"json:"name,omitempty"`
	Age        int    `column:"age"json:"age,omitempty"`
	CreateTime string `column:"create_time"json:"create_time,omitempty"`
}
```

## 创建 mapper结构体

```go
type StudentMapper struct {
}
```

## 创建 mapper 文件

更具 mapper 结构体的名称创建一个 mapper xml文件

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<mapper namespace="StudentMapper">

</mapper>
```

## 项目目录结构

```txt
|--root
|--model
|   |--student.go
|--mapper_test.go
|--StudentMapper.go
|--TagMapp.go
|--text.xml
```

## 初始化 gobatis

`mapper_test.go` 文件中初始化 `gobatis` 实例

```go
import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jimu-os/gobatis"
	"github.com/jimu-os/gobatis/examples/mapper_example/model"
	"testing"
	"time"
)

var open *sql.DB
var studentMapper = &StudentMapper{}
var tag = &TagTestMapper{}

func init() {
	var err error
	open, err = sql.Open("mysql", "root:Awen*0802^@tcp(localhost:3306)/gobatis?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		return
	}
	batis := gobatis.New(open)
	batis.Source("/")
	batis.ScanMappers(studentMapper, tag)
}
```

## 数据插入数据

### 添加 mapper 方法

此时你的 `mapper` 应该是下面的样子

```go
type StudentMapper struct {
	AddOne func(student model.Student) error
}
```

#### 添加 xml insert 标签

根据定义的字段名称,对应在 mapper 文件中添加一个 `id="AddOne"` insert 标签，
标签内书写需要执行的`sql`语句，`sql`语句中的变量通过 `{}` 的形式去加载解析

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<mapper namespace="StudentMapper">
    <insert id="AddOne">
        insert into student (name, age, create_time)
        values ({Name},{Age},{CreateTime});
    </insert>
</mapper>
```

#### 调用执行插入数据

下面通过测试对刚刚定义的插入方法进行执行，所有的前置步骤都在上面的初始化中准备好了，直接调用 `AddOne` 字段即可实现数据插入

```go
func TestInsert(t *testing.T) {
	var err error
	s := model.Student{
		Name:       "test",
		Age:        1,
		CreateTime: time.Now().Format("2006-01-02 15:04:05"),
	}
	if err = studentMapper.AddOne(s); err != nil {
		t.Error(err.Error())
		return
	}
}
```

### 执行行数 和 自增主键

定义mapper字段 `InsertId`,它有3个返回值，第一个返回值是执行sql返回的影响行数，第二个返回值是返回自增长逐渐值，
默认第一个参数是返回影响行数。

```go
type StudentMapper struct {
	AddOne   func(student model.Student) error
	InsertId func(student model.Student) (int64, int64, error)
}
```

#### 定义xml

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<mapper namespace="StudentMapper">
    <insert id="AddOne">
        insert into student (name, age, create_time)
        values ({Name},{Age},{CreateTime});
    </insert>
    <insert id="InsertId">
        insert into student (name, age, create_time)
        values ({Name},{Age},{CreateTime});
    </insert>
</mapper>
```

#### 执行测试

```go
func TestInsertId(t *testing.T) {
	var count, id int64
	s = model.Student{
		Name:       "test",
		Age:        2,
		CreateTime: time.Now().Format("2006-01-02 15:04:05"),
	}

	if count, id, err = studentMapper.InsertId(s); err != nil {
		t.Error(err.Error())
		return
	}
	t.Log("count:", count, "id:", id)
}
```

### 实现批量插入

添加新的方法，此时你的 `mapper` 应该是下面的样子

```go
type StudentMapper struct {
	AddOne   func(student model.Student) error
	InsertId func(student model.Student) (int64, int64, error)
	Adds     func(ctx any) error
}
```

#### 定义新的 mapper insert

此时你的的 mapper 应该是如下，添加了一个新的 insert 标签 `id="Adds"`，其中 使用`<for></for>` 标签对传递的数组数据进行了解析
`slice="{arr}"` 属性指定了属性名称为 arr 的数据，`item="stu"`表示的是迭代过程中的对象参数，更具数据元素来定，如果是基础数据，那么代表数据本身

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<mapper namespace="StudentMapper">
    <insert id="AddOne">
        insert into student (name, age, create_time)
        values ({Name},{Age},{CreateTime});
    </insert>
    <insert id="InsertId">
        insert into student (name, age, create_time)
        values ({Name},{Age},{CreateTime});
    </insert>
    <insert id="Adds">
        insert into student (name, age, create_time) values
        <for slice="{arr}" item="stu">
            ({stu.Name},{stu.Age},{stu.CreateTime})
        </for>
    </insert>
</mapper>
```

#### 调用执行

```go
// TestAdds
// 添加批量数据
func TestAdds(t *testing.T) {
	var err error
	var arr []any
	for i := 0; i < 10; i++ {
		s := model.Student{
			Name:       fmt.Sprintf("test_%d", i),
			Age:        i + 2,
			CreateTime: time.Now().Format("2006-01-02 15:04:05"),
		}
		arr = append(arr, s)
	}
	err = studentMapper.Adds(
		map[string]any{
			"arr": arr,
		},
	)
	if err != nil {
		t.Error(err.Error())
		return
	}
}
```

## 数据查询

#### 定义查询

定义了mapper字段 `QueryAll` 查询全部采用对应的切片模型进行接收即可，查询多条数据结果集的时候任然可以使用单个模型接收，
只是单个模型的数据仅仅取到结果集的第一条数据。

```go
type StudentMapper struct {
	AddOne   func(student model.Student) error
	InsertId func(student model.Student) (int64, int64, error)
	Adds     func(ctx any) error
	
	QueryAll func() ([]model.Student, error)
}
```

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<mapper namespace="StudentMapper">
    <insert id="AddOne">
        insert into student (name, age, create_time)
        values ({Name},{Age},{CreateTime});
    </insert>
    <insert id="InsertId">
        insert into student (name, age, create_time)
        values ({Name},{Age},{CreateTime});
    </insert>
    <insert id="Adds">
        insert into student (name, age, create_time) values
        <for slice="{arr}" item="stu">
            ({stu.Name},{stu.Age},{stu.CreateTime})
        </for>
    </insert>

    <select id="QueryAll">
        select * from student
    </select>
</mapper>
```

#### 执行

```go
func TestQueryAll(t *testing.T) {
	var stus []model.Student
	if stus, err = studentMapper.QueryAll(); err != nil {
		t.Error(err.Error())
		return
	}
	t.Log(stus)
}
```

## 分页查询

添加分页 mapper 字段 `QueryPage`，作为测试我们不进行参数传递，它返回3个参数，第一个参数是分页数据，第二个参数，是`sql`
条件所统计的总数，
查询mapper不返回 `int64` 的参数就不会自动统计数量

```go
type StudentMapper struct {
	AddOne   func(student model.Student) error
	InsertId func(student model.Student) (int64, int64, error)
	Adds     func(ctx any) error

	QueryAll  func() ([]model.Student, error)
	QueryPage func() ([]model.Student, int64, error)
}
```

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<mapper namespace="StudentMapper">
    <insert id="AddOne">
        insert into student (name, age, create_time)
        values ({Name},{Age},{CreateTime});
    </insert>
    <insert id="InsertId">
        insert into student (name, age, create_time)
        values ({Name},{Age},{CreateTime});
    </insert>
    <insert id="Adds">
        insert into student (name, age, create_time) values
        <for slice="{arr}" item="stu">
            ({stu.Name},{stu.Age},{stu.CreateTime})
        </for>
    </insert>

    <select id="QueryAll">
        select * from student
    </select>

    <select id="QueryPage">
        select * from student limit 2 offset 0
    </select>
</mapper>
```

#### 执行

```go
func TestQueryPage(t *testing.T) {
	var stus []model.Student
	var count int64
	if stus, count, err = studentMapper.QueryPage(); err != nil {
		t.Error(err.Error())
		return
	}
	t.Log("rows:", stus, "count:", count)
}
```

## 事务支持

定义一个数据修改操作，通过外部传递一个事务 `tx` 由它来完成数据库操作后的提交或是回滚，我们定义一个 `Update` 第二个参数传递事务

```go
type StudentMapper struct {
	AddOne   func(student model.Student) error
	InsertId func(student model.Student) (int64, int64, error)
	Adds     func(ctx any) error

	QueryAll  func() ([]model.Student, error)
	QueryPage func() ([]model.Student, int64, error)

	UpdateTx func(student model.Student, tx *sql.Tx) (int64, error)
	DeleteTx func(student model.Student, tx *sql.Tx) (int64, error)
}
```

编写sql语句，修改年龄大于5的数据姓名修改为AAA

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<mapper namespace="StudentMapper">
    <!--  略 ..  -->
    <update id="UpdateTx">
        update student set name={Name} where age>{Age}
    </update>
    <delete id="DeleteTx">
        delete
        from student
        where id = {id}
    </delete>
</mapper>
```

#### 运行测试

```go
// TestUpdateTx
// 自定义事务更新数据
func TestUpdateTx(t *testing.T) {
	var err error
	var begin *sql.Tx
	var count int64
	begin, err = open.Begin()
	if err != nil {
		t.Error(err.Error())
		return
	}
	u := model.Student{
		Name: "awen",
		Age:  5,
	}
	// 年龄大于5的name数据更新为 awen
	count, err = studentMapper.UpdateTx(u, begin)
	if err != nil {
		t.Error(err.Error())
		return
	}
	begin.Commit()
	t.Log(count)
}
```

```go
// TestDeleteTx
// 自定义事务删除数据
func TestDeleteTx(t *testing.T) {
	var err error
	var begin *sql.Tx
	var count int64
	begin, err = open.Begin()
	if err != nil {
		t.Error(err.Error())
		return
	}
	param := map[string]any{
		"id": 1,
	}
	count, err = studentMapper.DeleteTx(param, begin)
	if err != nil {
		t.Error(err.Error())
		return
	}
	begin.Commit()
	t.Log(count)
}
```

## if 标签的使用

编写 xml,`QueryIf` 查询中使用了`where`标签，在`where`标签中，使用if来对上下文参数进行判断，如果存在 if标签将被解析到语句中

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<mapper namespace="StudentMapper">
    <!--  略 ..  -->
    <select id="QueryIf">
        select * from student
        <where>
            <if expr="{name!=nil}">
                name={name}
            </if>
        </where>
    </select>
</mapper>
```

定义mapper字段

```go
type StudentMapper struct {
	AddOne   func(student model.Student) error
	InsertId func(student model.Student) (int64, int64, error)
	Adds     func(ctx any) error

	QueryAll  func() ([]model.Student, error)
	QueryPage func() ([]model.Student, int64, error)

	UpdateTx func(student model.Student, tx *sql.Tx) (int64, error)
	DeleteTx func(student model.Student, tx *sql.Tx) (int64, error)

	QueryIf func(any) (model.Student, error)
}
```

运行测试

```go
func TestIf(t *testing.T) {
	var stu model.Student
	args := map[string]any{
		"id": 1,
		"name": "test_0",
	}
	if stu, err = studentMapper.QueryIf(args); err != nil {
		t.Error(err.Error())
		return
	}
	t.Log(stu)
}
```