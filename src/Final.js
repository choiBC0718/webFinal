import React from 'react';
import {useState} from 'react';

const Main = ({setPage}) => { //초기 화면
    return (
        <div style={{textAlign:'center'}}>
            <h1>To Do List & Emotion Diary</h1>
            <img src='/icon/main.jpg' width='800px' style={{display:'block', margin:'0px auto'}} />
            <button 
                style={{font:'35px bold',margin:'10px 15px 0 0'}}
                onClick={()=>setPage('todoHome')}>To Do List</button>
            <button 
                style={{font:'35px bold',marginTop:'10px'}}
                onClick={()=>setPage('emotionHome')}>감정 기록</button>
        </div>
    )
}

const EmotionHome = ({setPage,emoteData}) => {    //감정 기록 열람 페이지  ★★★★★★★★★★밑에 수정/삭제 버튼 기능 추가★★★★★★★★★★
    return (
        <div>
            <h1 style={{margin:'30 0 20 50'}}>감정 기록
                <button style={{fontSize:'20px',fontWeight:'600', marginLeft:'50px'}}
                onClick={()=>setPage('emotionInsert')}>추가</button>
                <button style={{fontSize:'20px',fontWeight:'600', marginLeft:'10px'}}
                onClick={()=>setPage('main')}>이전 화면</button>
            </h1><hr style={{width:'1150px',marginLeft:'0'}} />
            <table>
                <tr style={{height:'50px',}}>
                    <td style={{fontSize:'25px',fontWeight:'600',width:'200px',textAlign:'center',borderBottom:'2px solid black'}}>날짜</td>
                    <td style={{fontSize:'25px',fontWeight:'600',width:'130px',textAlign:'center',borderBottom:'2px solid black'}}>평균 기분</td>
                    <td style={{fontSize:'25px',fontWeight:'600',width:'300px',textAlign:'center',borderBottom:'2px solid black'}}>Best Thing<img src="/icon/best.jpg" width='30px' /></td>
                    <td style={{fontSize:'25px',fontWeight:'600',width:'300px',textAlign:'center',borderBottom:'2px solid black'}}>Worst Thing<img src="/icon/worst.jpg" width='30px' /></td>
                    <td style={{fontSize:'25px',fontWeight:'600',width:'120px',textAlign:'center',borderBottom:'2px solid black'}}>비고</td>
                </tr>
                {emoteData.map((emote)=>(
                    <tr style={{height:'40px'}}>
                        <td style={{fontSize:'20px',fontWeight:'500',width:'200px',textAlign:'center'}}>{emote.date}</td>
                        <td style={{fontSize:'20px',fontWeight:'500',width:'130px',textAlign:'center'}}>{emote.avg}</td>
                        <td style={{fontSize:'20px',fontWeight:'500',width:'300px',textAlign:'center'}}>{emote.best}</td>
                        <td style={{fontSize:'20px',fontWeight:'500',width:'300px',textAlign:'center'}}>{emote.worst}</td>
                        <td style={{fontSize:'20px',fontWeight:'500',width:'120px',textAlign:'center'}}>
                            <button style={{fontSize:'18px'}}>수정</button>
                            &nbsp;
                            <button style={{fontSize:'18px'}}>삭제</button>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    )
}


const EmotionInsert = ({setPage,emoteData,setEmoteData}) => {  //감정 추가 페이지
    const [items,setItems]=useState([]);
    const [title,setTitle]=useState('');
    const [date,setDate]=useState('');

    const addItem=(text)=>{
        const newItem={id:items.length+1,text,score:0};
        setItems([...items,newItem]);
        setTitle('');
    };
    const scoreChange=(id,score)=>{
        const updateItem=items.map((item)=>
            item.id==id ? {...item,score}:item
        );
        setItems(updateItem);
    };
    const calAvgScore=(items)=>{
        let total=0;
        if (items.length==0) return '0.00';
        items.map(item=>{
            total+=item.score;
        });
        return (total/items.length).toFixed(2);
    };
    const saveEmote=()=>{
        if(!date){
            alert("날짜를 선택해주세요!");
            return;
        }
        const bestItem=items.reduce((max,item)=>item.score > max.score ? item:max,items[0]);
        const worstItem=items.reduce((min,item)=>item.score < min.score ? item:min,items[0]);

        const newEmote={
            id : emoteData.length+1,
            date:date,
            avg: calAvgScore(items),
            details: items,
            best: bestItem.text,
            worst:worstItem.text,
        };
        setEmoteData([...emoteData,newEmote]);
        setItems([]);
        setPage('emotionHome')
    };

    return (
        <div>
            <h1 style={{margin:'30 0 20 50'}}>감정 추가
            <button style={{fontSize:'20px',fontWeight:'600', marginLeft:'50px'}}
            onClick={()=>setPage('emotionHome')}>이전</button>
            </h1><hr style={{width:'700px',marginLeft:'0'}} />
            <table style={{border:'2px solid black', borderCollapse:'collapse',textAlign:'center',fontSize:'20px', width:'500px'}}>
                <tr>
                    <th style={{borderBottom:'1px solid grey',padding:'10px'}}>날짜</th>
                    <td style={{borderBottom:'1px solid grey'}}>
                        <input type='date' style={{height:'30px',width:'203px'}} value={date} onChange={(evt)=>setDate(evt.target.value)}/>
                    </td>
                </tr>
                <tr>
                    <th style={{padding:'10px'}}>사건 추가</th>
                    <td style={{textAlign:'center'}}>
                        <input type='text' placeholder='작성 후 엔터 or 버튼' style={{height:'30px',width:'150px',marginRight:'10px'}} value={title}
                        onKeyDown={(evt)=>{
                            if (evt.key=='Enter'){
                                addItem(title);
                            }
                        }}
                        onChange={(evt)=>{setTitle(evt.target.value)}} />
                        <button style={{height:'30px'}}
                        onClick={(evt)=>{
                            addItem(title);
                        }}>추가</button>
                    </td>
                </tr>
            </table><hr style={{width:'700px',marginLeft:'0'}} />
            
            <div>
                {items.map((item)=>(
                    <div key={item.id} style={{margin:'10px 0'}}>
                        <div style={{marginRight:'60px',fontSize:'20px',fontWeight:'600', display:'inline-block',width:'220px'}}>{item.text}</div>
                        <label>
                            <input type='radio' name={`score-${item.id}`} value='1' onChange={()=>scoreChange(item.id,1)} />
                            <span>1점</span>
                            <img src="/icon/worst.jpg" width='30px' style={{marginRight:'10px'}} />
                        </label>
                        <label>
                            <input type='radio' name={`score-${item.id}`} value='2' onChange={()=>scoreChange(item.id,2)} />
                            <span>2점</span>
                            <img src="/icon/bad.jpg" width='30px' style={{marginRight:'10px'}} />
                        </label>
                        <label>
                            <input type='radio' name={`score-${item.id}`} value='3' onChange={()=>scoreChange(item.id,3)} />
                            <span>3점</span>
                            <img src="/icon/soso.jpg" width='30px' style={{marginRight:'10px'}} />
                        </label>
                        <label>
                            <input type='radio' name={`score-${item.id}`} value='4' onChange={()=>scoreChange(item.id,4)} />
                            <span>4점</span>
                            <img src="/icon/good.jpg" width='30px' style={{marginRight:'10px'}} />
                        </label>
                        <label>
                            <input type='radio' name={`score-${item.id}`} value='5' onChange={()=>scoreChange(item.id,5)} />
                            <span>5점</span>
                            <img src="/icon/best.jpg" width='30px' style={{marginRight:'10px'}} />
                        </label>
                    </div>
                ))}
            </div><hr style={{width:'700px',marginLeft:'0'}} />

            <div>
                <strong>평균 점수 : {calAvgScore(items)}</strong>
                <button style={{marginLeft:'500px',fontSize:'20px',fontWeight:'600'}} onClick={saveEmote}>저장</button>
            </div>
        </div>
    )
}

const TodoHome = ({setPage}) => {       //할 일 열람 페이지
    return (
        <div>
            <h1 style={{margin:'30 0 20 50'}}>To Do List
            <button style={{fontSize:'20px',fontWeight:'600', marginLeft:'50px'}}
                onClick={()=>setPage('todoInsert')}>추가</button>
                <button style={{fontSize:'20px',fontWeight:'600', marginLeft:'10px'}}
                onClick={()=>setPage('main')}>이전 화면</button>
            </h1><hr style={{width:'800px',marginLeft:'0'}} />

        </div>
    )
}

const TodoInsert = ({setPage}) => {     //할 일 추가 페이지
    return (
        <div>
            <button style={{fontSize:'20px',fontWeight:'600', marginLeft:'10px'}}
            onClick={()=>setPage('todoHome')}>이전</button>
        </div>
    )
}

export default function Final(){
    const [page,setPage]=useState('main');
    const [emoteData,setEmoteData]=useState([]);

    let print;

    if (page=='main'){
        print=<Main setPage={setPage} />;
    }
    else if (page=='todoHome'){
        print=<TodoHome setPage={setPage} />;
    }
    else if (page=='emotionHome'){
        print=<EmotionHome setPage={setPage} emoteData={emoteData} />;
    }
    else if (page=='emotionInsert'){
        print=<EmotionInsert setPage={setPage} emoteData={emoteData} setEmoteData={setEmoteData} />;
    }
    else if (page=='todoInsert'){
        print=<TodoInsert setPage={setPage} />;
    }
    

    return (
        <div>
            {print}
        </div>
    )
}
