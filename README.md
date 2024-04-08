<p align="center">
  <img src="./src/assets/icons/auto-dog.png" alt="自动化小犬" style="border-radius:50%">
</p>
<h2 align="center">自动化小犬</h2>

<h3 align="center">你的手机模拟器是你的狗子，现在请让你狗子变得成熟吧！</h3>

## 功能

- 通过一组预设的参数，让模拟器自动的完成一系列行为。
- 解放双手，告别重复性作业
  - 如果你是一名手机应用的黑盒测试员，你可以用一套参数，重复测试相同的功能。
  - 如果你每天需要签到，但由于过于懒惰而忘记签到，那么，你每天只需要按一执行按钮就可以签到。
  - 如果你每天需要用手机做一些重复性行为，那么它可以解决这些烦人的事情。
- 节约你的时间，让你的狗子享受愉快的重复性生活。

## 安装

### 要求

- 你需要一台不错的电脑。
- 你需要在电脑上面下载安卓模拟器。如果你可以获取安卓手机的 root 权限也可以。
- 你需要到[这里](https://github.com/zozero/auto-dog-execute)去下载执行端的代码，然后运行它。不过你使用方法一的话无需这步。

### 方法一

这是最简单的方法，你只需要点击[百度网盘](https://pan.baidu.com/s/1qtLPN5_FTD0JkrlTo_NfvQ?pwd=tw9q)下载`自动化小犬完整版.zip`文件就可以直接使用。

解压后双击运行`接入口.exe`，然后在双击运行`自动化小犬.exe`，最后打开你的模拟器。

这个方法让你无需下载执行端的文件。

### 方法二

可以直接下载我编译好的文件来使用，点击[这里](https://github.com/zozero/auto-dog/releases)，再 GitHub 上下载`auto-dog-windows.exe`，下载后可以直接运行，但需要注意你必须先去[这里](https://github.com/zozero/auto-dog-execute)下载执行端相关的文件。才能完整的使用。

### 方法二

如果你有足够的编程知识，你运行这些命令编译它。

下载源代码

```bash
$ git clone https://github.com/zozero/auto-dog
```

进入到项目目录

```bash
$ cd auto-dog
```

安装依赖

```bash
$ npm install
```

运行项目

```bash
$ npm run start
```

## 视频教程

[![IMAGE ALT TEXT](https://i1.hdslb.com/bfs/archive/a827b2f9488446872f71e4f96724ead9499a456c.jpg@320w_200h)](https://www.bilibili.com/video/BV1jx4y1v7is/?vd_source=94eb18e525a1fa647feaa8beb70f4ba2 "视频 小犬")

## 菜单说明

### 基础配置

- 执行端表格
  - 只需要添加 IP 端口就行，如果你没有更改执行端的配置，则无需做任何事情。
- 模拟器表格
  - 你可以添加一个你喜欢的名称，用于标识。
  - IP 端口可以查看具体手机模拟器或手机开放的端口，IP：如果是局域网那么可以打开命令行工具（cmd）查看，命令：`ipconfig `
  - 类型现在只有一种
  - 如果你下载的是模拟器那么也许不用更改
- 项目表格
  - 项目名可以随意，但最好要容易识别。
  - 其他的输入框内容是前两项，可以直接选择你需要的。

### 执行规划

它的原始任务来源于执行端的对应项目下任务间的逗号分隔文件文件（csv 文件）。这个功能实现时相当复杂，可能无法预料发生问题或错误。不过我已经尽可能修复了。

如果没有数据，可到任务编辑里面去添加。你最好按照`图片处理->方法编辑->步骤编辑->任务编辑->执行规划`这个流程使用。

你可以把原始任务拖动到每天任务、每周任务、每月任务。而每天任务、每周任务、每月任务可以拖动到今日任务种，如果时间恰当它会自动添加到今日任务中。你也可以把每天任务、每周任务、每月任务、今日任务拖到删除任务中。

执行只会执行今日任务中的任务。暂停会停止任务，执行端也会一起停止判断，但它仍将运行，期待下一次执行。

清空任务和表格是十分危险按钮，因为它会删除所有项目的任务数据，不过你只需要重新添加就行。它不会删除任何执行端的文件。

### 图片处理

在使用之前请确保，你已经打开了手机模拟器和执行端。

模拟器截屏：点击后可以获取模拟的当前屏幕，之后你可以对其中内容进行裁剪。

裁剪区域：可以滚动放大或者缩小，可以直接用鼠标框选区域。

截图：选择需要裁剪的范围后可以点击这个按钮，它会跳出一个表单弹框，你可以选择你需要的匹配方法。具体可以查看下面的表格内容。你可以查看相应参数的帮助信息。请不要忘记输入图片的名称。提交后会再弹出一个添加步骤的表单，你可以不用添加，后续再添加也可以。添加步骤后如果自动执行开关开了那么会自动让模拟器执行一次。相应的参数也可以查看下面的表格，或者查看帮助图标

重置：可以重置图片的位置。

### 图片展馆

它就是一个稍微好看的图片瀑布流，然而除了查看和删除外并没有什么用处。

### 方法编辑

展示所有的方法表格，你可以直接再表格中编辑大部分的参数，还有删除，修改后默认是自动保存，橙色开关可以关闭自动保存。当前有四种匹配方式。

#### 图片匹配

用截取的图片来再指定的位置匹配到截取的图片。它会返回图片所在位置的中心点。本质上它会先把图片转成灰度图，再调用匹配方法，详情查看[计算机可视化开源库（opencv）](https://docs.opencv.org/4.x/df/dfb/group__imgproc__object.html#ga586ebfb0a7fb604b35a23d85391329be)

#### 二值图片匹配

同图片匹配方法相同，只不过它添加了阈值，是先将图片变成黑白色的，之后再进行匹配。

#### 匹配再匹配

先匹配一次图片匹配或者二值图片匹配让后再匹配一次图片匹配，通过第一次匹配来确定大体的位置，然后再添加一个范围（X 偏移、Y 偏移），后再次匹配。

#### 无图匹配

截图时图片的中心位置，它只记录这个中心位置和图片无关，也就是说你可以随便指定一个位置让后去执行一些行为。

### 步骤编辑

你可以直接再表格种编辑已有的项目，你可以对具体步骤进行测试，看看是否符合预期。加号可以添加新的步骤表。

#### 添加步骤

点击添加按钮，然后输入相应参数，提交即可。

#### 开关

橙色的是自动保存开关，绿色的是自动执行开关，自动执行只会在提交的时候触发。

#### 其他

参数请查看[参数说明](#参数说明)

### 任务编辑

你可以直接再表格种编辑已有的项目，你可以测试一整个任务。加号可以添加新的任务表。任务是由许多步骤组成的。它可以是一整步骤表。

#### 其他问题可以查看视频教程。

## 参数说明

### 图片匹配

<table>
  <colgroup>
    <col style="width: 100px;">
    <col style="width: 130px;">
    <col>
  </colgroup>
  <tr>
    <th>参数名</th>
    <th>示例</th>
    <th>说明</th>
  </tr>
   <tr>
    <td>序号</td>
    <td>1</td>
    <td>用于在其他表格中定位该行数据</td>
  </tr>
  <tr>
    <td>图片名</td>
    <td>请随意</td>
    <td>图片的名字，无需后缀，它不能重复。你最好明白这种图所表述的意义。点击名称可以查看图片。</td>
  </tr>
  <tr>
    <td>范围</td>
    <td>379 226 587 432</td>
    <td>截取范围是左上和右下的坐标，格式：x1 y1 x2 y2，用空格隔开，x1和y1是搜索时的起始位置，可以是整数（包括负数，意味着反过来加减）和分数，分数意味着按照模拟器屏幕大小的百分比进行计算。也可以直接使用参数值，参数值是根据截图时大小向外扩了200像素。</td>
  </tr>
  </tr>
    <td>算法</td>
    <td>5</td>
    <td>匹配时使用的算法类型，公式可以在<a target="_blank" href="https://docs.opencv.org/4.x/df/dfb/group__imgproc__object.html#ga3a7850640f1fe1f58fe91a2d7583695d">opencv</a>里面看，使用该数值即可</td>
  </tr>
  <tr>
    <td>最低相似度</td>
    <td>0.8</td>
    <td>相似度太低可能会导致匹配错误的位置，太高可能匹配不到，0.8是常用数字。</td>
  </tr> 
  <tr>
    <td>额外补充</td>
    <td>0</td>
    <td>0表示不会触发增加使用图片之间结构相似度算法。1表示会使用，建议0。它可以在图片内容相同，但颜色不同时做出正确的匹配。</td>
  </tr>
</table>

### 二值图片匹配

<table>
  <colgroup>
    <col style="width: 100px;">
    <col style="width: 130px;">
    <col>
  </colgroup>
  <tr>
    <th>参数名</th>
    <th>示例</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>序号</td>
    <td>1</td>
    <td>用于在其他表格中定位该行数据</td>
  </tr>
  <tr>
    <td>图片名</td>
    <td>请随意</td>
    <td>图片的名字，无需后缀，它不能重复。你最好明白这种图所表述的意义。点击名称可以查看图片。</td>
  </tr>
  <tr>
    <td>范围</td>
    <td>379 226 587 432</td>
    <td>同上</td>
  </tr>
  <tr>
    <td>阈值</td>
    <td>180</td>
    <td>用于将图片二值化的阈值，0-255之间。</td>
  </tr>
  <tr>
    <td>阈值类型</td>
    <td>0</td>
    <td>一种计算阈值的算法，这里是默认0即可，把图片灰度之后再选择留下的颜色。具体情况需要查看<a target="_blank" href="https://docs.opencv.org/4.5.5/d7/d1b/group__imgproc__misc.html#gaa9e58d2860d4afa658ef70a9b1115576">opencv的算法</a>才能明白。这些算法是非常容易理解。</td>
  </tr>
  <tr>
    <td>算法</td>
    <td>5</td>
    <td>匹配时使用的算法类型，公式可以在<a target="_blank" href="https://docs.opencv.org/4.x/df/dfb/group__imgproc__object.html#ga3a7850640f1fe1f58fe91a2d7583695d">opencv</a>里面看，使用该数值即可</td>
  </tr>
  <tr>
    <td>最低相似度</td>
    <td>0.8</td>
    <td>相似度太低可能会导致匹配错误的位置，太高可能匹配不到，0.8是常用数字。</td>
  </tr> 
</table>

### 匹配再匹配

<table>
  <colgroup>
    <col style="width: 100px;">
    <col style="width: 130px;">
    <col>
  </colgroup>
  <tr>
    <th>参数名</th>
    <th>示例</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>序号</td>
    <td>1</td>
    <td>用于在其他表格中定位该行数据</td>
  </tr>
  <tr>
    <td>图片名</td>
    <td>请随意</td>
    <td>图片的名字，无需后缀，它不能重复。你最好明白这种图所表述的意义。点击名称可以查看图片。</td>
  </tr>
  <tr>
    <td>编码</td>
    <td>A1</td>
    <td>图片匹配或者二值图片匹配的编码，是字母加数字的组合，填写时可以查看具体的序号。</td>
  </tr>
  <tr>
    <td>X偏移</td>
    <td>500</td>
    <td>可以是负数，但必须是整数，两次匹配，第一次定位，公式：左上角x+预先截图的宽度+X偏移。</td>
  </tr>
  <tr>
    <td>Y偏移</td>
    <td>500</td>
    <td>可以是负数，但必须是整数，两次匹配，第一次定位，公式：左上角y+预先截图的高度+Y偏移。</td>
  </tr>
  <tr>
    <td>算法</td>
    <td>5</td>
    <td>匹配时使用的算法类型，公式可以在<a target="_blank" href="https://docs.opencv.org/4.x/df/dfb/group__imgproc__object.html#ga3a7850640f1fe1f58fe91a2d7583695d">opencv</a>里面看，使用该数值即可</td>
  </tr>
  <tr>
    <td>最低相似度</td>
    <td>0.8</td>
    <td>相似度太低可能会导致匹配错误的位置，太高可能匹配不到，0.8是常用数字。</td>
  </tr> 
  <tr>
    <td>额外补充</td>
    <td>0</td>
    <td>0表示不会触发增加使用图片之间结构相似度算法。1表示会使用，建议0。它可以在图片内容相同，但颜色不同时做出正确的匹配。</td>
  </tr>
</table>

### 无图匹配

<table>
  <colgroup>
    <col style="width: 100px;">
    <col style="width: 130px;">
    <col>
  </colgroup>
  <tr>
    <th>参数名</th>
    <th>示例</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>序号</td>
    <td>1</td>
    <td>用于在其他表格中定位该行数据</td>
  </tr>
  <tr>
    <td>图片名</td>
    <td>请随意</td>
    <td>图片的名字，无需后缀，它不能重复。图片是用查看的，名字是为了以后好回忆是做什么用的。</td>
  </tr>
  <tr>
    <td>X轴</td>
    <td>1200</td>
    <td>X轴上的坐标，默认是给截取的图片X轴的中心点。必须是自然数，可以直接填入</td>
  </tr>
  <tr>
    <td>Y轴</td>
    <td>500</td>
    <td>Y轴上的坐标，默认是给截取的图片Y轴的中心点。必须是自然数，可以直接填入</td>
  </tr>
</table>

### 多图匹配

<table>
  <colgroup>
    <col style="width: 100px;">
    <col style="width: 130px;">
    <col>
  </colgroup>
  <tr>
    <th>参数名</th>
    <th>示例</th>
    <th>说明</th>
  </tr>
   <tr>
    <td>序号</td>
    <td>1</td>
    <td>用于在其他表格中定位该行数据</td>
  </tr>
  <tr>
    <td>图片名</td>
    <td>请随意</td>
    <td>图片的名字，无需后缀，它不能重复。你最好明白这种图所表述的意义。点击名称可以查看图片。</td>
  </tr>
  <tr>
    <td>数量</td>
    <td>3</td>
    <td>图片的数量。图片主要是xxx-n.jpg，其中n就是第几张图片，由此来重复判断。</td>
  </tr>
  <tr>
    <td>范围</td>
    <td>0 0 1.0 1.0</td>
    <td>截取范围是左上和右下的坐标，格式：x1 y1 x2 y2，用空格隔开，x1和y1是搜索时的起始位置，可以是整数（包括负数，意味着反过来加减）和分数，分数意味着按照模拟器屏幕大小的百分比进行计算。也可以直接使用参数值，参数值是根据截图时大小向外扩了200像素。</td>
  </tr>
  </tr>
    <td>算法</td>
    <td>5</td>
    <td>匹配时使用的算法类型，公式可以在<a target="_blank" href="https://docs.opencv.org/4.x/df/dfb/group__imgproc__object.html#ga3a7850640f1fe1f58fe91a2d7583695d">opencv</a>里面看，使用该数值即可</td>
  </tr>
  <tr>
    <td>最低相似度</td>
    <td>0.8</td>
    <td>相似度太低可能会导致匹配错误的位置，太高可能匹配不到，0.8是常用数字。</td>
  </tr> 
  <tr>
    <td>额外补充</td>
    <td>0</td>
    <td>0表示不会触发增加使用图片之间结构相似度算法。1表示会使用，建议0。它可以在图片内容相同，但颜色不同时做出正确的匹配。</td>
  </tr>
</table>

### 步骤表格

<table>
  <colgroup>
    <col style="width: 100px;">
    <col style="width: 130px;">
    <col>
  </colgroup>
  <tr>
    <th>参数名</th>
    <th>示例</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>序号</td>
    <td>1</td>
    <td>用于在其他表格中定位该行数据</td>
  </tr>
  <tr>
    <td>名称</td>
    <td>请随意</td>
    <td>步骤的名字，随便的名称，但最好是中文，且不要重复。在开头加*号来避免没有找到就退出任务的逻辑。</td>
  </tr>
  <tr>
    <td>界面编码</td>
    <td>A10</td>
    <td>由匹配方法的编码，加具体的序号，例如A10，表示《图片匹配.csv》文件 的序号为10的那条数据。可以为空。A是图片匹配方法。也可以是其他方法。</td>
  </tr>
  <tr>
    <td>方法编码</td>
    <td>A10</td>
    <td>和界面编码相同。找到后会直接执行行为编码的行动。</td>
  </tr>
  <tr>
    <td>行为编码</td>
    <td>A</td>
    <td>执行某个动作，A表示点击，B表示滚动(例如：B150Y，数字是滑动量，X表示延宽滑动量，正数表示从左往右划，负数表示从右往左划，Y表示延高滑动量，正数表示手指由上到下，负数表示由下到上，可以是负数，如果X和Y都没有)。C是返回按钮，D是回到主界面的按钮。可以为空，意味着不执行任何动作。它只会在有方法编码的前提下才会触发。</td>
  </tr>
  <tr>
    <td>动后编码</td>
    <td>A1Z0</td>
    <td>前面A1和界面编码相同，后面Z表示找到了，0表示无限次循环，也可以是其它数字，找到了就继续循环直到没找到为止，在这期间它会重复执行行为编码的行为，直到找不到为止。但它还可以是J，表示没有找到就继续循环、执行行为。可以为空。</td>
  </tr>
  <tr>
    <td>循环次数</td>
    <td>0</td>
    <td>循环多少次，如果没有找到就会循环，0表示无限次，次数用尽没找到会退出当前任务。可以在名称前面加*号来避免。</td>
  </tr>
  <tr>
    <td>循环间隔</td>
    <td>1.0</td>
    <td>每次循环间隔多久，单位是秒。必须要有一个时间，不然可能会飞速的让你电脑卡机！！！</td>
  </tr>
</table>

### 任务表格

<table>
  <colgroup>
    <col style="width: 100px;">
    <col style="width: 130px;">
    <col>
  </colgroup>
  <tr>
    <th>参数名</th>
    <th>示例</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>序号</td>
    <td>1</td>
    <td>用于在表格中定位该行数据。</td>
  </tr>
  <tr>
    <td>名称</td>
    <td>某个步骤文件名</td>
    <td>它只能是步骤文件名。</td>
  </tr>
  <tr>
    <td>编号</td>
    <td>0</td>
    <td>步骤文件内各步骤对应的序号，如果是0表示整个文件是一个步骤组，会从第一个步骤执行到最后一个步骤。</td>
  </tr>
  <tr>
    <td>是</td>
    <td>2</td>
    <td>表示成功执行后需要前往的序号，该序号是任务里的序号。-1表示立即停止整个任务，0表示从头开始执行任务，大于零的数字表示具体的序号步骤。请注意它可能会导致无限循环！！！所以一定要小心让大的序号跳转到小的序号上。</td>
  </tr>
  <tr>
    <td>否</td>
    <td>-1</td>
    <td>表示成功失败后需要前往的序号，该序号是任务里的序号。-1表示立即停止整个任务，0表示从头开始执行任务，大于零的数字表示具体的序号步骤。请注意它可能会导致无限循环！！！所以一定要小心让大的序号跳转到小的序号上。</td>
  </tr>
</table>


### 方法编号表格

<table>
  <colgroup>
    <col style="width: 100px;">
    <col style="width: 130px;">
    <col>
  </colgroup>
  <tr>
    <th>方法名</th>
    <th>编号</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>图片匹配</td>
    <td>A</td>
    <td>使用图片去匹配指定屏幕范围内的内容。找到了就返回。</td>
  </tr>
  <tr>
    <td>二值图片匹配</td>
    <td>B</td>
    <td>先把图片变成黑白图后，在执行和图片匹配一样的模板匹配方法。</td>
  </tr>
  <tr>
    <td>匹配再匹配</td>
    <td>C</td>
    <td>先执行一遍图片匹配，然后根据匹配到的图片位置，再在偏移的范围内在次匹配找到图片出现的位置。可能后续会更改，将不同方法匹配不同方法，或者相同方法匹配相同方法。</td>
  </tr>
  <tr>
    <td>无图匹配</td>
    <td>D</td>
    <td>无需图片，它会直接返回真和固定位置，以方便执行。</td>
  </tr>
  <tr>
    <td>多图匹配</td>
    <td>E</td>
    <td>可以使用多张图片去同一个范围内找到所需的内容。一般用于动图，或者一些列表页面中。</td>
  </tr>
  <tr>
    <td>你只看一次</td>
    <td>F</td>
    <td>使用你只看一次（yolo）版本8的图像识别模型，训练时可能需要对电脑有一定要求。</td>
  </tr>
</table>


### 动作编号表格

<table>
  <colgroup>
    <col style="width: 100px;">
    <col style="width: 130px;">
    <col>
  </colgroup>
  <tr>
    <th>方法名</th>
    <th>编号</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>点击</td>
    <td>A</td>
    <td>手机中点击一下的操作</td>
  </tr>
  <tr>
    <td>滑动</td>
    <td>B</td>
    <td>可以向上向下、向左向右滑动。</td>
  </tr>
  <tr>
    <td>返回</td>
    <td>C</td>
    <td>手机中全局的返回按钮。</td>
  </tr>
  <tr>
    <td>主界面</td>
    <td>D</td>
    <td>可以直接回到的手机的主界面，相当于手机中home键。</td>
  </tr>
</table>

## 注意

该项目只适合个人使用，因为它没有做任何权限管理，切勿将其暴露在公网当中，尽可能在局域网内使用它。

如果非要这么做，请务必在路由器管理界面中指定来源的 ip 地址或者媒体存取控制位址（mac 地址），这样可以直接避免未知来源的电脑访问到你的程序。（请搜索“端口转发”相关的知识。）

如果你使用的是手机，最好找一台没有任何个人信息和财产的无用手机。

关于编码的问题。我在项目中 csv 文件使用 gbk 编码，这是为了方便使用 excel 直接打开 csv 文件。

## 赞助

<p align="center">
    <img src="./src/assets/捐赠.png" alt="捐赠" style="border-radius:50%" />
</p>  
<h3 align="center">贫穷常伴吾身，急需救援一波</h3>

## 许可证

许可证是特别的，你几乎可以无条件使用这个开源库。你可以在这里[查看](许可证)许可证。

关于angular-electron框架的许可证，请在这里[查看](https://github.com/maximegris/angular-electron/blob/main/LICENSE.md)
