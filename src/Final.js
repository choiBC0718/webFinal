import React from 'react';
import {useState} from 'react';

const Home = ({setPage}) => {
    return (
        <div style={{ textAlign:'center'}}>
            <h1>감정 일기장</h1>
            <img src="/icon/main.jpg" width='800px' style={{display:'block', margin:'0 auto'}} />
            <button onClick={()=>setPage('record')} style={{marginTop:'15px', padding:'10px 20px', font:'20px bold'}}>감정 기록</button>
        </div>
    )
}

const Record = ({setPage, recorded}) => {
    return (
        <div>
            <button onClick={()=>setPage('home')} style={{font:'20px bold'}}>HOME</button>
            <h1>감정 기록 페이지</h1> 
            <hr />
            <ul style={{margin:'0px'}}>
                <li style={{display:'inline-block', marginRight:'50px'}}>날짜</li>
                <li style={{display:'inline-block', marginRight:'50px'}}>평균 감정</li>
                <li style={{display:'inline-block', marginRight:'50px'}}>가장 좋았던 일<img src="/icon/best.jpg" width='20px' /></li>
                <li style={{display:'inline-block', marginRight:'50px'}}>가장 안좋았던 일<img src="/icon/worst.jpg" width='20px' /></li>
                <li style={{display:'inline-block'}}>
                    <button onClick={()=>setPage('addPage')} style={{marginRight:'10px', font:'20px bold'}}>추가</button>
                    <button style={{marginRight:'10px', font:'20px bold'}}>삭제</button>
                </li>
            </ul>
            <hr />
            {recorded.map((record) =>(
                <div key={record.id}>
                    <ul style={{margin:'0px'}}>
                        <li style={{display:'inline-block', marginRight:'50px'}}>{record.date}</li>
                        <li style={{display:'inline-block', marginRight:'50px'}}>{record.avg}</li>
                        <li style={{display:'inline-block', marginRight:'50px'}}>{record.best}</li>
                        <li style={{display:'inline-block', marginRight:'50px'}}>{record.worst}</li>
                    </ul>
                </div>
            ))}
        </div>
    )
}

const InsertData = ({setPage, recorded, setRecorded}) => {
    const [newThing,setNewThing]=useState('');
    const [items,setItems]=useState([]);
    const [date,setDate]=useState('');

    const handleAdd = (text) => {
        const newItem = { id: items.length + 1, text, score: 0 }; // 초기 점수는 0
        setItems([...items, newItem]);
        setNewThing('');
    };

    // 항목 점수 업데이트
    const handleScoreChange = (id, score) => {
        const updatedItems = items.map((item) =>
            item.id === id ? { ...item, score } : item
        );
        setItems(updatedItems);
    };

    // 평균 점수 계산
    const calculateAverage = () => {
        const totalScore = items.reduce((sum, item) => sum + (item.score || 0), 0);
        const scoredItems = items.filter((item) => item.score > 0).length;
        return scoredItems > 0 ? (totalScore / scoredItems).toFixed(2) : '0.00';
    };

    // 저장 버튼 클릭 시 recorded 업데이트
    const handleSave = () => {
        if(!date){
            alert('날짜를 선택해주세요!');
            return;
        }
        const newRecord = {
            id: recorded.length + 1,
            date: date,
            avg: calculateAverage(),
            details: items,
        };
        setRecorded([...recorded, newRecord]);
        setItems([]); // 항목 초기화
        setPage('record');
    };

    return (
        <div>
            <button onClick={()=>setPage('record')} style={{font:'20px bold'}}>이전화면</button>
            <div>날짜 : <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}></input></div>
            <div>추가할 내용 : 
                <input type='text' value={newThing}
                onKeyDown={(e)=>{
                    if (e.key=='Enter' && newThing.trim()){
                        handleAdd(newThing.trim());
                    }
                }}
                onChange={(e)=>setNewThing(e.target.value)} />
            </div>
            <div>
                {items.map((item)=>(
                    <div key={item.id} style={{margin:'10px 0px'}}>
                        <span>{item.text}</span>
                        {[1,2,3,4,5].map((score)=>(
                            <label key={score}>
                                <input type='radio' name={`score-${item.id}`} value={score} onChange={()=>handleScoreChange(item.id,score)} />{score}
                            </label>
                        ))}
                    </div>
                ))}
            </div>
            <div>
                <strong>평균 점수 :</strong>{calculateAverage()}
            </div>
            <button onClick={handleSave}>저장</button>
        </div>
    )
}

const View = ({setPage}) => {
    return (
        <div>
            <h1>과거 감정 확인</h1>
            <button onClick={()=>setPage('home')}>HOME</button>
        </div>
    )
}

export default function Final(){
    const [page, setPage] = useState('home');
    const [recorded, setRecorded]=useState([]);

    let content;

    if (page=='home'){
        content= <Home setPage={setPage} />;
    }
    else if (page=='record'){
        content= <Record setPage={setPage} recorded={recorded} />;
    }
    else if (page=='view'){
        content= <View setPage={setPage} />;
    }
    else if (page=='addPage'){
        content= <InsertData setPage={setPage} recorded={recorded} setRecorded={setRecorded} />;
    }

    return (
        <div>
            {content}
        </div>
    )
}