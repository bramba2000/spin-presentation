--- 
theme: academic
layout: cover
coverAuthor: Matteo Brambilla - Paolo Cerutti - Carlo Chiodaroli
css: unocss
download: true
highlighter: shiki
---

# SPIN
## A tool to _**verify**_ them all

---
layout: table-of-contents
columns: 2
hideInToc: true
---
# What are we going to see?

---
layout: center
class: "text-center"

---
# Basic concepts
---
layout: default
src: ./pages/prom-intro/introduction.md
---

---
---

## Variable definition

- 5 basic types, default initialized to `0`

```promela
    bit turn=1; /*[0..1]*/        bool flag=true; /*[0..1]*/ 
    byte counter; /*[0..255]*/ 
    short s; /*16-bit signed*/    int msg; /*32-bit signed*/
```

<v-click>

- Array

```promela
    byte a[10]; /*array of 10 bytes*/
```
</v-click>

<v-click>

- Create enum with `mtype`
```promela
    mtype = {A, B, C};
    mtype d;
```
</v-click>
---
hideInToc: true
---

## Variable definition

<v-click>

- More complex type defined using `typedef`
```promela
    typedef My_array {
        byte a[10];
        int b;
    }
    My_array a; /*declaration of new type*/
    a.b = 10; /*access to field*/
```
</v-click>

<v-click>

- Variables could be used in **assignments** or **expression**
```promela
    a = 10;
    a = a + 1;
    a >= 10
```

</v-click>
---

## Statements

A statement is a single instruction that can be executed by the program
<v-clicks>

<div>

- **Executable** if it could be executed immediately
    - Assignments are always executable
</div>

<div>

- **Blocked** if it cannot
    - Expression are blocked if they evaluate to `0`
</div>

```promela
    2 < 3   //always executable
    x < 27  //only executable if value of x is smaller 27
    3 + x   //executable if x is not equal to –3
```

- `skip` is always executable, just change process counter(more later)
- `assert(<expr>)` is always executable, but if `<expr>` evaluates to `0` the program stops

</v-clicks>
---
layout: center
class: "text-center"
---

# Modelling behavior
---

## Processes
Processes are the main component of a Promela program. They are the basic behavioral unit and are executed **concurrently**. 

```promela
    proctype Foo() {
        ...
    }
```



<v-clicks>

- They are defined using `proctype` keyword
- They communicate with others using *global variables* and *channels*
- They are created using `run`, which returns the process id
    - They could be created at any moment by other processes
    - They start **immediately after** the run statement
- They could be started at creation using `active`, eventually with a quantity to spawn more process at the same time
    ```promela
            active[2] proctype Bar() {
                ...
            }
    ```
</v-clicks>


---
clicks: 3
---

## Hello world
```promela
    /* A "Hello World" Promela model for SPIN. */
    active proctype Hello() {
        printf("Hello process, my pid is: %d\n", _pid);
    }
    init {
        int lastpid;
        printf("init process, my pid is: %d\n", _pid);
        lastpid = run Hello();
        printf("last pid was: %d\n", lastpid);
    }
```

<v-clicks>

- `init` is the first process to be executed
- `printf` is a built-in function to print on the console
- `_pid` is a built-in variable that contains the process id
</v-clicks>
<arrow v-click="3" x1="130" y1="370" x2="380" y2="160" color="#581845" width="3" arrowSize="1" />
<arrow v-click="3" x1="130" y1="370" x2="380" y2="240" color="#581845" width="3" arrowSize="1" />

---
layout: center
class: "text-center"

---
# Control flow
---

## `if` statement

```promela
    if
    :: <expr> -> <statement>; ...
    :: <expr> -> <statement>; ...
    :: else -> <statement>; ...
    fi;
```
<v-clicks>

<div>

- execute the statement of an executable `<expr>`
</div>

<div>

- the `else` branch is executed if all the other are blocked
</div>

<div>

- if no `<expr>` is executable and `else` branch not provided, the process is blocked
</div>


<Callout>
<template #icon> 📖 </template>

The `->` operator is an alias for `;` used to separate the `<expr>` from the `<statement>`
</Callout>
</v-clicks>

<v-click>

- Useful to model non-deterministic branching
<TwoCols>
<template #left>

```promela
        if
        :: skip -> x = 0;
        :: skip -> x = 1;
        :: skip -> x = 2;
        fi;
```
</template> 
<template #right>
<div>

<img src="/images/ng92be0a.png" class="w-1/2 right-0" alt="non deterministic branch" />
</div>    
</template>
</TwoCols>
</v-click>

---

## `do` statement

```promela
    do
    :: <expr> -> <statement>; ...
    :: <expr> -> <statement>; ...
    :: <expr> -> break ...
    :: else -> <statement>; ...
    od;
```
<v-clicks>
  
- works like `if` but at the end of the statement list it restarts from the choice point
- if no `<expr>` is executable the process is blocked; `else` branch could be provided
- the `break` statement is used to exit the loop
</v-clicks>

---
layout: center
class: "text-center"
---

# Communication

---
---
## Communication

The communication between processes is done using **channels**. A channel is a **FIFO** queue of messages. 

```promela
    chan c = [10] of {byte, int};
```

<v-clicks>

- The channel must have a **bounded size**
- The message structure supported by the channel is defined in the `of` clause
</v-clicks>

---
hideInToc: true
---
## Communication
<TwoCols>
<template #left>

### Send
A message is sent to a channel using the `!` operator
```promela
    channel! <expr>, <expr> ...;
``` 

The action is executable only if the channel is **not full**
</template>
<template #right>

### Receive
A message is received from a channel using the `?` operator
```promela
    channel? <var>, <var> ...;
``` 

The action is executable only if the channel is **not empty**

</template>
</TwoCols>

<Callout>
<template #icon>❗</template>

The `<expr>` type must match the message type defined in the `of` clause
</Callout>

<v-click>
<br>

If instead of a variable is provided at least one constant value or an enum value, the statement is executable _only if the message attributes match the provided constants_
<arrow x1="500" y1="420" x2="600" y2="240" color="#581845" width="4" arrowSize="1" />
</v-click>

---
hideInToc: true
clicks: 2
---

## Communication - handshaking
It is possible to use **channels** as synchronization mechanism between processes. The channel size must be `0`

- The sender is blocked until the receiver is ready to receive the message

```promela{all|3,7}
    chan c = [0] of {bit, byte};
    proctype Sender() {
        c!1, 3+4;
    }
    proctype Receiver() {
        byte x;
        c?1, x;
    }
```
<v-clicks>
    
- Only when both processes are ready these statements are considered executable
</v-clicks>


---
layout: center
class: "text-center"
---

# Synchronization concepts

---
---

## Atomic blocks
All the single statements are atomic, but it is possible to group them in a block to make them atomic together

```promela
    atomic {
        <statement>; ...
        <statement>; ...
    }
```

<v-clicks>

- It is executable if the first statement is executable
- It one of the following statements is not executable, the process is temporarily suspended
</v-clicks>
<p v-after class="color-red absolute top-60 right-45 opacity-70 transform rotate-5">No pure atomicity!</p>

---
hideInToc: true
---

## Atomic blocks
Real total atomicity is obtained with the `d_step` statement

```promela
    d_step {
        <statement>; ...
        <statement>; ...
    }
```

<v-clicks>

- It is executable if the first statement is executable
- It one of the following statements is not executable generates a <span class="color-red">runtime error</span>
</v-clicks>

---
---

## Time model
Promela is a **functional language**, so it does not have a time model.
<v-clicks>

However, process often require clock or timeout to resend data

<div>
This is possible to model using the `timeout` statement
```promela
    active proctype Receiver() 
    {
        bit recvbit;
        do
            :: toR ? MSG, recvbit -> toS ! ACK, recvbit;
            :: timeout -> toS ! ACK, recvbit;
        od
    }
```
</div>

- `timeout` is executable if no other statements are executable
- `timeout` is used to escape from _deadlocks_
</v-clicks>


---
---

<div class="text-left float-left">

# Goto

Goto is used as unconditional jump to a label
```promela
    goto <label>;
```


- `label` is an identifier that precedes a statement
- `goto` jump to the label and executes the statement
- Useful to model _communication protocols_
</div>
<div class="color-red absolute top-10 right-10 ">

```promela {all|1|8|all}
wait_ack:
    if
    :: B?ACK -> ab=1-ab ; goto success
    :: ChunkTimeout?SHAKE -> 
        if
        :: (rc < MAX) -> rc++; 
                         F!(i==1),(i==n),ab,d[i];
                         goto wait_ack
        :: (rc >= MAX) -> goto error
        fi
    fi ;
```
</div>
<v-click >

<div class="text-left float-right">

<p class="text-right">

# Unless
</p>
```promela
    {<statement> ...} unless {<guard>; <err_stat> ...};
```

- Execute `statement` until `guard` is true, then execute `err_stat`
- Useful to model _exception handling_

</div>
</v-click>

---
layout: center
class: "text-center"
---

# LTL logic

---
---
## LTL formula

<br>
```promela
    ltl ::= opd | ( ltl ) | ltl binop ltl | unop ltl
```
<br>
<v-clicks>

- `opd` is an operand
- `unop` is a unary operator
    - `[]` is the **globally** operator $\square$
    - `<>` is the **eventually** operator $\diamond$
    - `!` is the **negation** operator $\neg$

</v-clicks>
---
hideInToc: true
---

## LTL formula
<br>
```promela
    ltl ::= opd | ( ltl ) | ltl binop ltl | unop ltl
```
<br>

- `opd` is an operand
- `unop` is a unary operator
- `binop` is a binary operator
    - `U` is the temporal operator **strong until**
	- `W`	is the temporal operator **weak until** (only when used in inline formula)
	- `V` is the dual of U: `(p V q)` means `!(!p U !q)`
	- `&&` or `/\` is the **logical and** operator
	- `||` or `\/` is the **logical or** operator
	- `->`	is the logical **implication** operator
	- `<->`	is the logical **equivalence** operator

---
---

## LTL usage
A *ltl* property should be declared in global scope, like a global variable 

```promela
    ltl [name] { formula };
```
<br>
<v-click>

```promela
    ltl p { [] b }; // b always true

    bool b = true;
    active proctype main() {
        printf("hello world!\n");
        b = false;
    }

```

</v-click>

---
layout: center
class: "text-center"

---
# C code
---
---

## C Code

Starting from Spin `v4.0` it is possible to use C code in Promela with some limitations

It's primarily used by automatic verification tool, like **Modex** that we will see later, to model complex statement
<v-clicks>
<TwoCols>
<template #left>

- declaration of complex type or struct
</template>
<template #right>
```promela
    c_decl {<typedef>};
    c_code {<type> <identifier>};
    c_track "&<identifier>" "sizeof(<type>)";
```
</template>
</TwoCols>
<TwoCols>
<template #left>

- atomic expression 
</template>
<template #right>
```promela
    c_code {<expr>};
```
</template>
</TwoCols>
<TwoCols>
<template #left>

- atomic expression executable only when evaluate to _non zero_ value
</template>
<template #right>
```promela
    c_expr{<expr>};
```
</template>
</TwoCols>
<Callout>
    <template #icon>⚠️</template>

`c_expr` must contain only one statement without any side effect because could be executed multiple times

</Callout>
</v-clicks>
---
---
## C & Promela
<v-clicks>
<div>

- C code could access _global_ identifier declared in Promela using `now` followed by a dot because it refers to the **state vector**
```promela
    c_code { now.<identifier> = <expr>; }
```
</div>
<div>

- C code could access _local_ identifier declared inside process using `P` followed by the name of the `proctype` and the pointer arrow because it refers to the **state vector** of the process
```promela
    c_code { P<proctypeName>-><identifier> = <expr>; }
```
</div>

<div>

- Promela code could access C identifiers declared with `c_decl` after they have been inserted into the state vector.
This approach substitute the usage of `c_track`
```promela
    c_state "<type> <identifier>" "Global|Local";
```
</div>
</v-clicks>
---
---
## Execution
In order to execute a model that contains some C code instruction we have to use the `gcc` compiler to translate id

```sh
    $spin -a model.pml 
    $gcc -o pan pan.c
    $./pan
```