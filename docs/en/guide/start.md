---
layout: doc
---

# quick get start

## Create table

Create a `student` table for testing purposes

```sql
create table student
(
    id          int auto_increment primary key,
    name        varchar(20) null,
    age         int         null,
    create_time datetime    null
);
```

## Create a mapping model

Create a structure based on database tables or SQL query result sets to receive query data, where the value of the `column` attribute corresponds to the column name defined in the SQL table

```go
// Student 
type Student struct {
	Id         int    `column:"id"json:"id,omitempty"`
	Name       string `column:"name"json:"name,omitempty"`
	Age        int    `column:"age"json:"age,omitempty"`
	CreateTime string `column:"create_time"json:"create_time,omitempty"`
}
```

## Create mapper structure

```go
type StudentMapper struct {
}
```

## Create a mapper file

Create a mapper XML file with a more mapper structured name

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<mapper namespace="StudentMapper">

</mapper>
```

## Project directory structure

```txt
|--root
|--model
|   |--student.go
|--mapper_test.go
|--StudentMapper.go
|--TagMapp.go
|--text.xml
```

## Initialize gobatis

Initialize an instance of `gobatis` in `the mapper_test. go` file

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

## Data insertion

### Add mapper method

At this point, your `mapper` should look like the following

```go
type StudentMapper struct {
	AddOne func(student model.Student) error
}
```

#### Add XML insert tag

Add an `id="AddOne"` insert tag to the mapper file based on the defined field name,
Write the `SQL` statement that needs to be executed within the tag, and the variables in the `SQL` statement are loaded and parsed in the form of `{}`

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<mapper namespace="StudentMapper">
    <insert id="AddOne">
        insert into student (name, age, create_time)
        values ({Name},{Age},{CreateTime});
    </insert>
</mapper>
```

#### Call to execute insert data

Next, execute the newly defined insertion method through testing, and all the pre steps are prepared in the initialization above. Simply call the `AddOne` field to achieve data insertion

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

### Execute row count and auto increment primary key

Define the mapper field `InsertId`, which has three return values. The first return value is the number of rows affected by the execution of SQL, and the second return value is the incremental value of self growth,
The default first parameter is to return the number of affected rows.

```go
type StudentMapper struct {
	AddOne   func(student model.Student) error
	InsertId func(student model.Student) (int64, int64, error)
}
```

#### Define XML

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

#### Perform testing

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

### Implement batch insertion

Add a new method, and at this point your `mapper` should look like the following

```go
type StudentMapper struct {
	AddOne   func(student model.Student) error
	InsertId func(student model.Student) (int64, int64, error)
	Adds     func(ctx any) error
}
```

#### Define a new mapper insert

At this point, your mapper should be as follows, with a new insert tag `id="Add"` added, where the `<for></for>` tag is used to parse the passed array data
`Slice="{arr}"` The attribute specifies the data with the attribute name arr, while `item="stu"`represents the object parameters during the iteration process, which are determined by data elements. If it is basic data, it represents the data itself

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

#### Call Execution

```go
// TestAdds
// Add batch data
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

## Data Query

#### Define Query

The mapper field `QueryAll` has been defined, and all queries can be received using the corresponding slicing model. When querying multiple datasets, a single model can still be used to receive them,
Only the data of a single model is taken from the first data in the result set.

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

#### implement

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

## Pagination query

Add the paging mapper field `QueryPage`. As a test, we do not pass any parameters. It returns three parameters. The first parameter is paging data, and the second parameter is `SQL`
The total number of conditions counted,
If the mapper does not return a parameter of `int64`, the quantity will not be automatically counted

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

#### implement

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

## Transaction support

Define a data modification operation and pass a transaction `tx` externally to complete the commit or rollback of the database operation. We define an `Update` parameter and pass the transaction as the second parameter

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

Write SQL statements to modify the names of data aged over 5 to AAA

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

#### implement

```go
// TestUpdateTx
// Custom transaction update data
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
// Custom transaction deletion data
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

## The use of if tags

Write XML using the `where` tag in the `QueryIf` query. In the 'where' tag, use if to determine the context parameters. If there is an if tag, it will be parsed into the statement

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<mapper namespace="StudentMapper">
    <!--   ..  -->
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

Define mapper fields

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

Running tests

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