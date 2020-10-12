---
title: Variables
permalink: /transformations/variables/
---

* TOC
{:toc}

Variables allow you to parametrize transformations. This is useful when you have similar transformations
which differ in only a limited number of values. You can have for example a transformation which
processes all orders from the the Meals department and with variables you can modify to work also for the
Drinks department.

## Variables
Transformation variables are unrelated to the transformation code itself. I.e. they do not manifest themselves
as SQL or Python variables. Transformation variables are evaluated before the transformation is run and
are valid for entire configuration (all code blocks, shared code, mapping, etc.). Variables are referenced
in the configuration using the 
[Moustache Variable syntax](https://scalate.github.io/scalate/documentation/mustache.html#Variables).

All variables referenced in the code must be defined in the variables section. All defined variables 
have to have assigned values.

### Example
Consider the following transformation:

{% highlight sql %}
CREATE OR REPLACE TABLE "result" AS
	SELECT "first", "second" * 42 AS "larger_second" FROM "source";
{% endhighlight %}

To parametrize the multiplier value (42), you can change it to a variable `{{ "{{ multiplier " }}}}`:

{% highlight sql %}
CREATE OR REPLACE TABLE "result" AS
	SELECT "first", "second" * {{multiplier}} AS "larger_second" FROM "source";
{% endhighlight %}

When you define variable, you have to provide default value:

{: .image-popup}
![Screenshot - Variables Configuration](/transformations/variables/variables-setting.png)

When you run a transformation, you can provide a runtime override of the default value:

{: .image-popup}
![Screenshot - Running Transformation](/transformations/variables/variables-run.png)

When a variable is referenced in the code but not defined, or its values is missing, 
you'll get an error:

    Missing values for placeholders: "multiplier"

or

    No value provided for variable "multiplier".


### Orchestration Usage
When you use [orchestrations](/orchestrator/) to automate transformations with variables, you can
either rely on the default values, or you can override them for each orchestration task.
This can be done by configuration of task parameters:

{: .image-popup}
![Screenshot - Orchestration Task Parameters](/transformations/variables/orchestration-parameters.png)

There you can set variable values override:

{: .image-popup}
![Screenshot - Task Parameters](/transformations/variables/task-parameters.png)

In the [above example](/transformations/variables/#example), you can override the default 
value by **adding** the following to the configuration json:

{% highlight json %}
	"variableValuesData": {
		"values": [
			{
				"name": "multiplier",
				"value": "1000"
			}
		]
	}
{% endhighlight %}

The resulting configuration will look similar to this:

{% highlight json %}
{
	"config": "6939",
	"variableValuesData": {
		"values": [
			{
				"name": "multiplier",
				"value": "1000"
			}
		]
	}
}
{% endhighlight %}

## Shared Code
Shared code i slightly related to variables in that it is another option how to make the
transformation code more dynamic. Shared code allows you to share pieces of code between
otherwise unrelated transformations. Like with the variables, the shared code is evaluated
before the transformation runs. This means that it does not interfere with your
transformation code.

There are two ways how to create shared code --- from the main transformation page:

{: .image-popup}
![Screenshot - Create Shared Code](/transformations/variables/shared-code.png)

Or from an existing transformation code:

{: .image-popup}
![Screenshot - Create Shared Code from Transformation](/transformations/variables/shared-code-2.png)

You have to enter name for the shared code and optionally you can also specify 
[variables](/transformations/variables/#variables) for the shared code. When you share an 
existing piece of transformation code, the code and code type is filled automatically.

{: .image-popup}
![Screenshot - Shared Code Detail](/transformations/variables/shared-code-detail.png)

### Using Shared Code
You can use Shared code when editing a transformation:

{: .image-popup}
![Screenshot - Shared Code Use](/transformations/variables/shared-code-use-1.png)

Select the shared code you want to use. There are two options how you can use it:

- **Use Inline** --- This will make a copy of the shared code in the transformation you're editing. There 
won't be any link between the transformation and the shared code.
- **Use as Shared Code** --- This will link the shared code with the transformation. When you modify the
shared code, it will modify in all linked transformations.

{: .image-popup}
![Screenshot - Shared Code Use](/transformations/variables/shared-code-use-2.png)

When the code is inserted as shared code, you can always unlink the transformation
from the shared code by selecting **Use as Inline Code** from the dots menu:

{: .image-popup}
![Screenshot - Shared Code Use](/transformations/variables/shared-code-use-3.png)

{: .image-popup}
![Screenshot - Shared Code Use](/transformations/variables/shared-code-use-4.png)

### Modifying Shared Code
When a shared code is linked to transformations, you can review its usage in the dots menu:

{: .image-popup}
![Screenshot - Shared Code List](/transformations/variables/shared-code-edit.png)

You'll se a list of transformations to which the shared code is linked. The transformations
in which the shared code was used inline are not listed, because there is not link.

{: .image-popup}
![Screenshot - Shared Code Usage](/transformations/variables/shared-code-usage.png)

When you attempt to edit a shared code, you'll also see the list of transformation in 
which it is used. You can either change the code --- which has the potential to break
the transformations in which it is used. Or you can create a copy and use that in 
transformations.

{: .image-popup}
![Screenshot - Shared Code Edit](/transformations/variables/shared-code-edit-2.png)

Also when you try to delete a shared code, you'll see the list of transformations which use it.
When you delete a shared code that is used, the transformations using it will stop working.

{: .image-popup}
![Screenshot - Shared Code Delete](/transformations/variables/shared-code-delete.png)

Transformations referencing a deleted shared code fail with a message similar to this:

    Shared code configuration cannot be read: Row 10433 not found

### Example Using Shared Code
Let's say that you have a lot of SQL transformations which have one table in
input mapping. You have several transformations, e.g:

{% highlight sql %}
CREATE OR REPLACE TABLE "result" AS
	SELECT *, "second" * 42 AS "larger_second" FROM "source";
{% endhighlight %}

Because of [Clone mapping](/transformations/mappings/#snowflake-loading-type), you have 
to drop the `_timestamp` column from the source by executing query:

{% highlight sql %}
ALTER TABLE "source" DROP COLUMN "_timestamp";
{% endhighlight %}

You can create the following shared code:

{: .image-popup}
![Screenshot - Create Shared Code](/transformations/variables/shared-code-drop-1.png)

*Note: When defining Shared code for Snowflake, the Shared code can contain only one query*

**Important: the SQL query must end with semicolon `;`**

Add the shared code to the transformation. Drag & Drop it before the main transformation code:

{: .image-popup}
![Screenshot - Use Code](/transformations/variables/shared-code-drop-2.png)

The main code being:

{% highlight sql %}
CREATE OR REPLACE TABLE "result" AS
	SELECT "first", "second" * 42 AS "larger_second" FROM "source";
{% endhighlight %}

When you run the transformation, you can see in the events, what code has been executed: 

{: .image-popup}
![Screenshot - Use Code](/transformations/variables/shared-code-events.png)

### Example Shared Code with Variables
You can also define variables for shared code. To extend the 
[above example](/transformations/variables/#example-using-shared-code), let's 
say that you want to parameterize the name of the table from which the `_timestamp` 
column is dropped.

You can modify the shared code to:

{% highlight sql %}
ALTER TABLE "{{source}}" DROP COLUMN "_timestamp";
{% endhighlight %}

And add the `source` variable:

{: .image-popup}
![Screenshot - Shared Code with Variables](/transformations/variables/shared-code-variables-1.png)

The transformation will detect that the value for the `source` variable is not defined:

{: .image-popup}
![Screenshot - Shared Code in Transformation](/transformations/variables/shared-code-variables-2.png)

Set the `source` value to the [destination name](/transformations/mappings/#table-input-mapping) of the 
table in the *Table Input Mapping* (`source-table` in this case):

{: .image-popup}
![Screenshot - Shared Code with set Variables](/transformations/variables/shared-code-variables-3.png)

When you run the transformation, you can verify the executed queries in the job events, there
you can see that the shared code query manipulated the `source-table`:

{: .image-popup}
![Screenshot - Shared Code with set Variables](/transformations/variables/shared-code-variables-4.png)
