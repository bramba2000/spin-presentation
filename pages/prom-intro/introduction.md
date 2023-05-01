---
layout: default
---

# Promela language
C-like language for modeling concurrent systems

<v-click>

- **Identifiers** are strings of letters, digits and underscores, starting with a letter, `.` or `_` 

</v-click>


<v-click>

- **Keywords** are reserved words (_only 45_)
```promela{all}
    active		assert		atomic		bit
    bool		break		byte		chan
    d_step		D_proctype	do		else
    empty		enabled		fi		full
    goto		hidden		if		init
    int		len		mtype		nempty
    never		nfull		od		of
    pc_value	printf		priority	proctype
    provided	run		short		skip
    timeout		typedef		unless		unsigned
    xr		xs
```

</v-click>

---
hideInToc: true
---

# Promela language
C-like language for modeling concurrent systems

- **Identifiers** are strings of letters, digits and underscores, starting with a letter, `.` or `_` 
- **Keywords** are reserved words (_only 45_)
- **Comments** are C-like with `/* */`
<v-click> 

- **Operators** are C-like 
```promela
    +	    -	    *	  /	    %	    >
	>=	    <	    <=	  ==	!=	    !
	&	    ||	    &&	  |	    ~	    >>
	<<	    ^	    ++    --
	len()	empty()	nempty()	nfull()	full()
	run	    eval()	enabled()	pc_value()
```
</v-click>