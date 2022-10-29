
var btn1 = document.getElementById('btn1');
function paperquery() {
    var use_arxiv=false;
    var topic = document.getElementsByName("Topic");
	var topic_list = new Array();
	for(var i=0; i<topic.length;i++){
	    if (topic[i].value!='')
		topic_list[i] = topic[i].value.toLowerCase();
	}
	var keyword = document.getElementsByName("Keyword");
	var keyword_list = new Array();
	for(var j=0; j<keyword.length;j++){
	    if (keyword[j].value!='')
		    keyword_list[j] = keyword[j].value.toLowerCase();
	}
	
	var id = document.getElementsByName('source');
    var conf_source = new Array();
    for(var k = 0; k < id.length; k++)
    {
        if(id[k].checked) 
        {
            if (id[k].value=='arxiv') {use_arxiv=true;continue;}
            conf_source.push(id[k].value);
        }
    }
    
    var conf_lib={};
    for(var m = 0; m<conf_source.length;m++){
        $.ajaxSetup({async:false});
        $.getJSON("./database/"+conf_source[m]+"_statistics.json",function(data){
        conf_lib[conf_source[m]]=data;
    });
    }
    
    var visited_item=[];
    var topic_count={};
    var keywrd_count={};
    var topic_show={};
    var keywrd_show={};
    for (let conf in conf_source) 
    {
        topic_count[conf_source[conf]]={}
        for (let t in topic_list)
        {
        
            topic_count[conf_source[conf]][topic_list[t]]=0;
        }
    }
    for (let conf in conf_source) 
    {
        keywrd_count[conf_source[conf]]={};
        for (let t in topic_list)
        {
            keywrd_count[conf_source[conf]][topic_list[t]]={};
            for (let k in keyword_list)
            {
                keywrd_count[conf_source[conf]][topic_list[t]][keyword_list[k]]=0;
            }
        }
    }
    
    for (let conf in conf_source) 
    {
        topic_show[conf_source[conf]]={};
        for (let t in topic_list)
        {
        
            topic_show[conf_source[conf]][topic_list[t]]=[];
        }
    }
    for (let conf in conf_source) 
    {
        keywrd_show[conf_source[conf]]={};
        for (let t in topic_list)
        {
            keywrd_show[conf_source[conf]][topic_list[t]]={};
            for (let k in keyword_list)
            {
                keywrd_show[conf_source[conf]][topic_list[t]][keyword_list[k]]=[];
            }
        }
    }
    
    
    for (let conf in conf_source) 
    {
        var lib=conf_lib[conf_source[conf]];
        for (let paper in lib)
        {
            name=lib[paper]['title'].toLowerCase();
            for (let t in topic_list)
            {
                if ((name.indexOf(topic_list[t])!=-1 ) && (visited_item.indexOf(name)==-1))
                {
                    if (lib[paper]['abstract'] != null)
                    {
                        abs=lib[paper]['abstract'].toLowerCase();
                    }
                    else
                    {
                        abs='';
                    }
                    topic_count[conf_source[conf]][topic_list[t]]+=1;
                    topic_show[conf_source[conf]][topic_list[t]].push(lib[paper]['title']);
                    for (let k1 in keyword_list)
                    {
                        if (abs.indexOf(keyword_list[k1]) != -1)
                        {
                            keywrd_count[conf_source[conf]][topic_list[t]][keyword_list[k1]]+=1;
                            keywrd_show[conf_source[conf]][topic_list[t]][keyword_list[k1]].push(lib[paper]['title']);
                            visited_item.push(name);
                        }
                    }
                    
                }
            }
            
        }
    }
    
    var quantative = document.getElementById("quantative_results");
    while(quantative.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        quantative.removeChild(quantative.firstChild);
    }
    var top="Quantative Results";
    var text = document.createTextNode(top);
    var conftopic = document.createElement("h2");//创建一个html标签
    conftopic.appendChild(text);
    quantative.appendChild(conftopic);
    for (let conf in conf_source) 
    {
        var conf_topic="In "+conf_source[conf]+ " 2022";
        var line=document.createElement("hr");
        var text_3 = document.createTextNode(conf_topic);
        var conftopic_1 = document.createElement("h2");//创建一个html标签
        conftopic_1.appendChild(text_3);
        quantative.appendChild(line);
        quantative.appendChild(conftopic_1);
        
        for (let t in topic_list)
        {
            var c_topic="There are "+topic_count[conf_source[conf]][topic_list[t]]+" papers about "+topic_list[t];
            var text_1 = document.createTextNode(c_topic);
            var ctopic = document.createElement("h4");//创建一个html标签
            ctopic.appendChild(text_1);
            quantative.appendChild(ctopic);
            for (let k in keyword_list)
            {
                var k_topic="There are "+keywrd_count[conf_source[conf]][topic_list[t]][keyword_list[k]]+" papers about "+keyword_list[k]+" in the field of "+topic_list[t];
                var text_2 = document.createTextNode(k_topic);
                var ctopic = document.createElement("h4");
                ctopic.appendChild(text_2);
                quantative.appendChild(ctopic);
            }
        }
    }
    
    var line=document.createElement("hr");
    quantative.appendChild(line);
    
    var paper = document.getElementById("paper_results");
    while(paper.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        paper.removeChild(paper.firstChild);
    }
    
    var top="Paper Results";
    var text = document.createTextNode(top);
    var conftopic = document.createElement("h2");//创建一个html标签
    conftopic.appendChild(text);
    paper.appendChild(conftopic);
    for (let conf in conf_source) 
    {
        var conf_topic="In "+conf_source[conf]+ " 2022";
        var text_3 = document.createTextNode(conf_topic);
        var conftopic_1 = document.createElement("h2");//创建一个html标签
        conftopic_1.appendChild(text_3);
        paper.appendChild(conftopic_1)
        
        for (let t in topic_list)
        {
            var c_topic="All papers about "+topic_list[t];
            var text_1 = document.createTextNode(c_topic);
            var ctopic = document.createElement("h4");//创建一个html标签
            ctopic.appendChild(text_1);
            paper.appendChild(ctopic);
            
            var topic_paper_title = document.createElement("div");//创建一个html标签
            
            for (let i in topic_show[conf_source[conf]][topic_list[t]])
            {
                topic_paper_title.append("Title: " + topic_show[conf_source[conf]][topic_list[t]][i] + "<br />")
            }
            var ele=topic_paper_title.innerText;
            topic_paper_title.innerHTML=ele;
            paper.appendChild(topic_paper_title);
            
            for (let k in keyword_list)
            {
                var c_topic="All papers about "+keyword_list[k] +" in the field of " + topic_list[t];
                var text_1 = document.createTextNode(c_topic);
                var ctopic = document.createElement("h4");//创建一个html标签
                ctopic.appendChild(text_1);
                paper.appendChild(ctopic);
            
                var kwd_paper_title = document.createElement("div");//创建一个html标签
            
                for (let i in keywrd_show[conf_source[conf]][topic_list[t]][keyword_list[k]])
                {
                    kwd_paper_title.append("Title: " + keywrd_show[conf_source[conf]][topic_list[t]][keyword_list[k]][i] + "<br />")
                }
                var ele=kwd_paper_title.innerText;
                kwd_paper_title.innerHTML=ele;
                paper.appendChild(kwd_paper_title);
            }
        }
    }
    var arxiv = document.getElementById("arxiv_re");
    while(arxiv.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        arxiv.removeChild(arxiv.firstChild);
    }
    if (use_arxiv == true)
    {
        var arxiv_results = document.createElement("div");
        var c_topic = "Results in Arxiv";
        var text_1 = document.createTextNode(c_topic);
        var ctopic = document.createElement("h2");//创建一个html标签
        ctopic.appendChild(text_1);
        arxiv_results.appendChild(ctopic);
        for (let t in topic_list)
        {
            if (keyword_list.length==0)
            {
                var subset_results = document.createElement("div");
                var subset_content = document.createElement("div");
                $.when(arxiv_search({title:topic_list[t]})).then( function(data) {
                $(subset_content).append("<h4>Papers in the field of " + topic_list[t] +" in Arxiv</h4>")
                for (var i = 0; i < data.length; ++i) 
                {
                    $(subset_content).append("Title: " + data[i].title + "<br />Author: " + data[i].authors[0] + "<br />URL: <a href='" + data[i].link + "'>" + data[i].link + "</a><br /><br />");
                }
                });
                subset_results.appendChild(subset_content);
                arxiv_results.append(subset_results);
            }
            for (let k in keyword_list)
            {   
                var subset_results = document.createElement("div");
                var subset_content = document.createElement("div");
                $.when(arxiv_search({title:topic_list[t],abstrct:keyword_list[k]})).then( function(data) {
                $(subset_content).append("<h4>Papers about "+keyword_list[k] +" in the field of " + topic_list[t] +" in Arxiv</h4>")
                for (var i = 0; i < data.length; ++i) 
                {
                    $(subset_content).append("Title: " + data[i].title + "<br />Author: " + data[i].authors[0] + "<br />URL: <a href='" + data[i].link + "'>" + data[i].link + "</a><br /><br />");
                }
                });
                subset_results.appendChild(subset_content);
                arxiv_results.append(subset_results);
                
            }
        }
        arxiv.appendChild(arxiv_results)
        
    }
    
}
function add_topic(){
    var li1 = document.getElementById("li1");
    //创建li
    var lis = document.createElement("li");
    //创建文本
    var texts =document.createElement('input');
    texts.setAttribute('type', 'text');//输入框的类型
    texts.setAttribute('name', "Topic");//输入框的名字
    //把文本添加到li下面 appendChild
    lis.appendChild(texts);
    //获取到div
    var topic = document.getElementById("topic"); 
    topic.insertBefore(lis,li1);
}

function add_keyword(){
    var li2 = document.getElementById("li2");
    //创建li
    var lis = document.createElement("li");
    //创建文本
    var texts =document.createElement('input');
    texts.setAttribute('type', 'text');//输入框的类型
    texts.setAttribute('name', "Keyword");//输入框的名字
    //把文本添加到li下面 appendChild
    lis.appendChild(texts);
    //获取到div
    var keyword = document.getElementById("keyword"); 
    keyword.insertBefore(lis,li2);
}

/* Copyright (c) 2016 Frase
 *
 * Distributed under MIT license (see LICENSE).
 *
 *
 * Search arXiv via its HTTP API
 *
 * can search the following 1 or more fields:
 *   - author
 *   - title
 *   - abstract
 *   - journal reference
 *   - All fields
 *   journal's referenced, as well as all fields.
 */



/**
 * Searches arXiv for papers/documents that match the supplied parameters
 * @param {string} all
 * @param {string} author
 * @param {string} title
 * @param {string} abstrct
 * @param {string} journal_ref
 * @returns {Promise}
 */
function arxiv_search({all, author, title, abstrct, journal_ref}) {
    var baseUrl = "http://export.arxiv.org/api/query?sortBy=submittedDate&sortOrder=descending&search_query=";
    var first = true;
    
    if (author) {
	if (!first) {
	    baseUrl += '+AND+';
	}
	baseUrl += "au:" + author;
	first = false;
    }
    
    if (title) {
	if (!first) {
	    baseUrl += '+AND+';
	}
	baseUrl += "ti:" + title;
	first = false;
    }
    
    if (abstrct) {
	if (!first) {
	    baseUrl += '+AND+';
	}
	baseUrl += "abs:" + abstrct;
	first = false;
    }
    
    if (all) {
	if (!first) {
	    baseUrl += '+AND+';
	}
	baseUrl += "all:" + all;
    }

    var deferred = $.Deferred();
    $.ajax({
        url: baseUrl,
        type: "get",
        dataType: "xml",
        success: function(xml) {
	    var entry = [];
	    $(xml).find('entry').each(function (index) {
		var id = $(this).find('id').text();
		var pub_date = $(this).find('published').text();
		var title = $(this).find('title').text();
		var summary = $(this).find('summary').text();
		var authors = [];
		$(this).find('author').each(function (index) {
		    authors.push($(this).text());
		});
		
		entry.push({'title': title,
			    'link': id,
			    'summary': summary,
			    'date': pub_date,
			    'authors': authors
			   });
	    });
	    
	    deferred.resolve(entry);
        },
        error: function(status) {
            console.log("request error " + status + " for url: "+baseUrl);
        }
    });
    return deferred.promise();
}