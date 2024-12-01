import React from 'react';
import {useState} from 'react';
import {useRef} from 'react';
import {useEffect} from 'react';

const Main = ({setPage}) => { //초기 화면
    return (
        <div style={{textAlign:'center'}}>
            <h1>To Do List & Emotion Diary</h1>
            <img src='/icon/main.jpg' width='800px' style={{display:'block', margin:'0px auto'}} />
            <button 
                style={{fontSize:'35px',fontWeight:'800',margin:'10px 15px 0 0',width:'220px',height:'70px'}}
                onClick={()=>setPage('todoHome')}>To Do List</button>
            <button 
                style={{fontSize:'35px',fontWeight:'800',margin:'10px 0 0 15',width:'220px',height:'70px'}}
                onClick={()=>setPage('emotionHome')}>감정 기록</button>
        </div>
    )
};

const EmotionHome = ({ setPage, emoteData, setEmoteData,setEditData }) => {

    const editEmote = (id) => {
        const targetEmote = emoteData.find((emote)=> emote.id ==id);
        setEditData(targetEmote);
        setPage('emotionInsert');
    };
    const deleteEmote = (id) => {
        let delOk=confirm("삭제하시겠습니까?");
        if (delOk==true){
            const updatedEmoteData = emoteData.filter((emote) => emote.id !== id);
            setEmoteData(updatedEmoteData);
        }
        else return;
    };

    return (
        <div>
            <h1 style={{ margin: '30 0 20 50' }}>감정 기록
                <button style={{ fontSize: '20px', fontWeight: '600', marginLeft: '50px' }}
                    onClick={() => setPage('emotionInsert')}>추가</button>
                <button style={{ fontSize: '20px', fontWeight: '600', marginLeft: '10px' }}
                    onClick={() => setPage('main')}>이전 화면</button>
            </h1><hr style={{ width: '1070px', marginLeft: '0' }} />

            <table>
                <tr style={{ height: '50px' }}>
                    <td style={{ fontSize: '25px', fontWeight: '600', width: '200px', textAlign: 'center', borderBottom: '2px solid black' }}>날짜</td>
                    <td style={{ fontSize: '25px', fontWeight: '600', width: '130px', textAlign: 'center', borderBottom: '2px solid black' }}>평균 기분</td>
                    <td style={{ fontSize: '25px', fontWeight: '600', width: '300px', textAlign: 'center', borderBottom: '2px solid black' }}>Best Thing<img src="/icon/best.jpg" width='30px' /></td>
                    <td style={{ fontSize: '25px', fontWeight: '600', width: '300px', textAlign: 'center', borderBottom: '2px solid black' }}>Worst Thing<img src="/icon/worst.jpg" width='30px' /></td>
                    <td style={{ fontSize: '25px', fontWeight: '600', width: '120px', textAlign: 'center', borderBottom: '2px solid black' }}>비고</td>
                </tr>

                {emoteData.map((emote) => (
                    <tr style={{ height: '40px' }} key={emote.id}>
                        <td style={{ fontSize: '20px', fontWeight: '500', width: '200px', textAlign: 'center' }}>{emote.date}</td>
                        <td style={{ fontSize: '20px', fontWeight: '500', width: '130px', textAlign: 'center' }}>{emote.avg}</td>
                        <td style={{ fontSize: '20px', fontWeight: '500', width: '300px', textAlign: 'center' }}>{emote.best}</td>
                        <td style={{ fontSize: '20px', fontWeight: '500', width: '300px', textAlign: 'center' }}>{emote.worst}</td>
                        <td style={{ fontSize: '20px', fontWeight: '500', width: '120px', textAlign: 'center' }}>
                            <button style={{ fontSize: '18px' }} onClick={() => deleteEmote(emote.id)}>삭제</button>
                            &nbsp;
                            <button style={{ fontSize: '18px' }} onClick={() => editEmote(emote.id)}>수정</button>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

const EmotionInsert = ({setPage,emoteData,setEmoteData,editData,setEditData}) => {  //감정 추가 페이지
    const [items,setItems]=useState([]);
    const [checkItems,setCheckItems]=useState([]);
    const [title,setTitle]=useState('');
    const [date,setDate]=useState('');
    const textUi=useRef();

    useEffect(() => {
        if (editData){
            setItems(editData.details);
            setDate(editData.date);
        }
    },[editData]);

    const addItem=(text)=>{
        if (!date){
            alert("날짜를 선택해주세요!");
            return;
        }
        if (!title){
            alert("내용을 입력해주세요!");
            textUi.current.focus();
            return;
        }

        const newItem={id:items.length+1,text,score:3};
        setItems([...items,newItem]);
        if (items.length==0){
            setDate(new Date().toISOString().split("T")[0]);
        }
        setTitle('');
        textUi.current.focus();
    };
    const deleteItem = () => {
        if (checkItems.length==0){
            alert("선택한 항목이 없습니다");
            return;
        }
        let delOk=confirm("삭제하시겠습니까?");
        if (delOk==true){
            setItems(items.filter((item)=> !checkItems.includes(item.id)));
            setCheckItems([]);
        }
        else return;
    };
    const checkChange =(id) =>{
        setCheckItems((checked) =>{
            if (checked.includes(id)){
                return checked.filter((itemId) => itemId != id);
            }
            else{
                return [...checked,id];
            }
        });
    };
    const dateChange = (evt) =>{
        if (items.length >0){
            const confirmChange = confirm("날짜를 변경하시겠습니까? 데이터가 덮어씌워집니다");
            if (!confirmChange){
                evt.preventDefault();
                return;
            }
        }
        setDate(evt.target.value);
    }
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
        if (items.length==0){
            alert("입력한 데이터가 없습니다.");
            return;
        }
        const bestItem=items.reduce((max,item)=>item.score > max.score ? item:max,items[0]);
        const worstItem=items.reduce((min,item)=>item.score < min.score ? item:min,items[0]);

        const newEmote={
            id : editData ? editData.id : emoteData.length+1,
            date:date,
            avg: calAvgScore(items),
            details: items,
            best: bestItem.text,
            worst:worstItem.text,
        };

        if (editData){
            setEmoteData(emoteData.map((emote) => (emote.id == editData.id ? newEmote : emote)));
        }
        else{
            setEmoteData([...emoteData,newEmote]);
        }
        setItems([]);
        setEditData(null);
        setPage('emotionHome')
    };
    const dontSave=()=>{
        setItems([]);
        setEditData(null);
        setPage('emotionHome');
    }

    return (
        <div>
            <h1 style={{margin:'30 0 20 50'}}>감정 추가
            <button style={{fontSize:'20px',fontWeight:'600', marginLeft:'50px'}}
            onClick={dontSave}>이전</button>
            </h1><hr style={{width:'720px',marginLeft:'0'}} />

            <table style={{border:'2px solid black', borderCollapse:'collapse',textAlign:'center',fontSize:'20px', width:'500px'}}>
                <tr>
                    <th style={{borderBottom:'1px solid grey',padding:'10px'}}>날짜</th>
                    <td style={{borderBottom:'1px solid grey'}}>
                        <input 
                            type='date'
                            value={date}
                            style={{height:'30px',width:'203px'}}
                            onChange={dateChange} />
                    </td>
                </tr>
                <tr>
                    <th style={{padding:'10px'}}>사건 추가</th>
                    <td style={{textAlign:'center'}}>
                        <input 
                            type='text' 
                            placeholder='작성 후 엔터 or 버튼' 
                            value={title}
                            ref={textUi}
                            style={{height:'30px',width:'150px',marginRight:'10px'}} 
                            onKeyDown={(evt)=>{
                                if (evt.key=='Enter'){
                                    addItem(title);
                                }
                            }}
                        onChange={(evt)=>{setTitle(evt.target.value)}} />
                        <button style={{height:'30px'}} onClick={()=>{addItem(title);}}>추가</button>
                    </td>
                </tr>
            </table><hr style={{width:'720px',marginLeft:'0'}} />
            
            <div>
                {items.map((item)=>(
                    <div key={item.id} style={{margin:'10px 0'}}>
                        <label>
                            <input type='checkbox' onChange={()=>checkChange(item.id)} />
                            <div style={{marginRight:'60px',fontSize:'20px',fontWeight:'600', display:'inline-block',width:'220px'}}>{item.text}</div>
                        </label>
                        <label>
                            <input type='radio' name={`score-${item.id}`} value='1' onChange={()=>scoreChange(item.id,1)} checked={item.score == 1} />
                            <span>1점</span>
                            <img src="/icon/worst.jpg" width='30px' style={{marginRight:'10px'}} />
                        </label>
                        <label>
                            <input type='radio' name={`score-${item.id}`} value='2' onChange={()=>scoreChange(item.id,2)} checked={item.score == 2} />
                            <span>2점</span>
                            <img src="/icon/bad.jpg" width='30px' style={{marginRight:'10px'}} />
                        </label>
                        <label>
                            <input type='radio' name={`score-${item.id}`} value='3' onChange={()=>scoreChange(item.id,3)} checked={item.score == 3} />
                            <span>3점</span>
                            <img src="/icon/soso.jpg" width='30px' style={{marginRight:'10px'}} />
                        </label>
                        <label>
                            <input type='radio' name={`score-${item.id}`} value='4' onChange={()=>scoreChange(item.id,4)} checked={item.score == 4} />
                            <span>4점</span>
                            <img src="/icon/good.jpg" width='30px' style={{marginRight:'10px'}} />
                        </label>
                        <label>
                            <input type='radio' name={`score-${item.id}`} value='5' onChange={()=>scoreChange(item.id,5)} checked={item.score == 5} />
                            <span>5점</span>
                            <img src="/icon/best.jpg" width='30px' style={{marginRight:'10px'}} />
                        </label>
                    </div>
                ))}
            </div><hr style={{width:'720px',marginLeft:'0'}} />

            <div>
                <strong>평균 점수 : {calAvgScore(items)}</strong>
                <button style={{marginLeft:'470px',fontSize:'20px',fontWeight:'600'}} onClick={deleteItem} >삭제</button>
                <button style={{marginLeft:'20px',fontSize:'20px',fontWeight:'600'}} onClick={saveEmote}>저장</button>
            </div>
        </div>
    )
};

const TodoHome = ({ setPage, todoData, setTodoData }) => {
    const CheckboxChange = (id) => {
        setTodoData((prevData) =>
            prevData.map((todo) =>
                todo.id === id ? { ...todo, checked: !todo.checked } : todo
            )
        );
    };


    const totalCount = todoData.length;
    const checkedCount = todoData.filter((todo) => todo.checked).length;

    return (
        <div>
            <h1 style={{ margin: '30px 0 20px 50px' }}>To Do List
                <button
                    style={{ fontSize: '20px', fontWeight: '600', marginLeft: '50px' }}
                    onClick={() => setPage('todoInsert')}
                >
                    추가/수정
                </button>
                <button
                    style={{ fontSize: '20px', fontWeight: '600', marginLeft: '10px' }}
                    onClick={() => setPage('main')}
                >
                    이전 화면
                </button>
                <span style={{ fontSize: '20px', fontWeight: '600', marginLeft: '20px' }}>
                    완료 현황: {checkedCount}/{totalCount}
                </span>
            </h1>
            <hr style={{ width: '660px', marginLeft: '0' }} />

            <table style={{ textAlign: 'center' }}>
                <thead>
                    <tr style={{ height: '50px' }}>
                        <th style={{ fontSize: '25px', width: '50px', borderBottom: '2px solid black' }}>완료</th>
                        <th style={{ fontSize: '25px', width: '150px', borderBottom: '2px solid black' }}>카테고리</th>
                        <th style={{ fontSize: '25px', width: '450px', borderBottom: '2px solid black' }}>할 일</th>
                    </tr>
                </thead>
                <tbody>
                    {todoData.map((todo) => (
                        <tr key={todo.id} style={{ height: '40px' }}>
                            <td style={{ fontSize: '20px' }}>
                                <input
                                    type="checkbox"
                                    checked={todo.checked || false}
                                    onChange={() => CheckboxChange(todo.id)}
                                />
                            </td>
                            <td style={{ fontSize: '20px' }}>{todo.category}</td>
                            <td style={{ 
                                fontSize: '20px',
                                color: 'black',
                                textDecoration: todo.checked ? 'line-through red' : 'none'}}
                            >{todo.text}
                            </td> 
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const TodoInsert = ({setPage,todoData,setTodoData}) => {     //할 일 추가 페이지
    const [checkTodos,setCheckTodos]=useState([]);
    const [title,setTitle]=useState('');
    const [cate,setCate]=useState('');
    const textUi=useRef();

    const addTodo = (text) => {
        if (!title) {
            alert("내용을 입력해주세요!");
            textUi.current.focus();
            return;
        }
        if (!cate) {
            alert("카테고리를 선택해주세요!");
            return;
        }
        const newTodo = {
            id: todoData.length + 1,
            text,
            category: cate,
            checked: false, // 새로운 할 일에 기본적으로 체크되지 않은 상태를 설정
        };
        setTodoData([...todoData, newTodo]);
        setTitle('');
        textUi.current.focus();
    };
    
    const saveTodo=()=>{
        if (todoData.length==0){
            alert("입력한 데이터가 없습니다.");
            return;
        }
        setPage('todoHome');
    };
    const checkChange=(id)=>{
        setCheckTodos((checked)=>{
            if (checked.includes(id)){
                return checked.filter((todoId) => todoId != id);
            }
            else{
                return [...checked,id];
            }
        });
    };
    const deleteTodo=()=>{
        if (checkTodos.length==0){
            alert("선택한 항목이 없습니다.");
            return;
        }
        let delOk=confirm("삭제하시겠습니까?");
        if (delOk==true){
            setTodoData((origin)=> origin.filter((todo)=> !checkTodos.includes(todo.id)));
            setCheckTodos([]);
        }
        else return;
    };

    return (
        <div>
            <h1 style={{margin:'30 0 10 50'}}>할 일 추가
                <button style={{fontSize:'20px',fontWeight:'600', marginLeft:'10px'}}
                    onClick={()=>setPage('todoHome')}>이전</button>
            </h1><hr style={{width:'720px',marginLeft:'0'}} />

            <div style={{fontSize:'20px',fontWeight:'600',height:'40px',alignContent:'center'}}>
                <div style={{display:'inline-block', marginLeft:'10px'}}>
                    <span style={{marginRight:'10px'}}>카테고리</span>
                    <select 
                        name='category'
                        value={cate}
                        onChange={(evt)=>setCate(evt.target.value)}
                        style={{width:'65px',height:'25px',border:'2px solid black'}}>
                        <option value="">선택</option>
                        <option value='중요' style={{color:'red',fontWeight:'600'}}>중요</option>
                        <option value='일상' style={{color:'skyblue',fontWeight:'600'}}>일상</option>
                        <option value='공부' style={{color:'purple',fontWeight:'600'}}>공부</option>
                    </select>
                </div>
                <div style={{display:'inline-block', marginLeft:'50px'}}>
                    <span style={{margin:'0 10'}}>Task</span>
                    <input 
                        type='text'
                        placeholder='할 일 입력'
                        value={title}
                        ref={textUi}
                        style={{width:'200px',height:'25px',border:'2px solid black',}}
                        onKeyDown={(evt)=>{
                            if (evt.key=='Enter'){
                                addTodo(title);
                            }
                        }}
                        onChange={(evt)=>{setTitle(evt.target.value)}} />
                    <button 
                        style={{marginLeft:'5px',fontSize:'14px',height:'25px'}}
                        onClick={()=>{addTodo(title)}}>입력</button>
                </div>
            </div><hr style={{width:'720px',marginLeft:'0'}} />

            <div>
                {todoData.map((todo)=>(
                    <label key={todo.id} style={{display:'block',fontSize:'22px',margin:'10px',width:'500px'}}>
                        <input type='checkbox' onChange={()=>checkChange(todo.id)} />
                        <div style={{display:'inline-block',fontWeight:'600'}}>
                        {todo.category} - {todo.text}
                        </div>
                    </label>
                ))}
            </div><hr style={{width:'720px',marginLeft:'0'}} />

            <button style={{marginLeft:'20px',fontSize:'20px',fontWeight:'600'}} onClick={deleteTodo}>삭제</button>
            <button style={{marginLeft:'20px',fontSize:'20px',fontWeight:'600'}} onClick={saveTodo}>저장</button>
            
        </div>
    )
};

export default function Test() {
    const [page, setPage] = useState('main');
    const [emoteData, setEmoteData] = useState([]);
    const [todoData,setTodoData] = useState([]);
    const [editData,setEditData] = useState(null);

    let print;

    if (page === 'main') {
        print = <Main setPage={setPage} />;
    }
    else if (page === 'todoHome') {
        print = <TodoHome setPage={setPage} todoData={todoData} setTodoData={setTodoData} />;
    }
    else if (page === 'todoInsert') {
        print = <TodoInsert setPage={setPage} todoData={todoData} setTodoData={setTodoData} />;
    }

    else if (page === 'emotionHome') {
        print = <EmotionHome setPage={setPage} emoteData={emoteData} setEmoteData={setEmoteData} setEditData={setEditData} />;
    }
    else if (page === 'emotionInsert') {
        print = <EmotionInsert setPage={setPage} emoteData={emoteData} setEmoteData={setEmoteData} editData={editData} setEditData={setEditData} />;
    }

    return (
        <div>
            {print}
        </div>
    );
};
