import React from 'react';
import {useState} from 'react';
import {useRef} from 'react';
import {useEffect} from 'react';


const Main = ({ setPage }) => {
    return (
        <div>
            <table align='center'>
                <tr align='center'>
                    <td colspan='2'>
                        <h1>
                            To Do List & Emotion Diary
                        </h1>
                    </td>
                </tr>
                <tr align='center'>
                    <td colspan='2'>
                        <img src='/icon/main.jpg' width='600px' />
                    </td>
                </tr>
                <tr align='center'>
                    <td>
                        <button onClick={()=> setPage('emotionHome')}>감정 기록</button>
                    </td>
                    <td>
                        <button onClick={()=> setPage('todoHome')}>To Do List</button>
                    </td>
                </tr>
            </table>
        </div>
    );
};

const EmotionHome = ({ setPage, emoteData, setEmoteData,setEditData }) => {

    const editEmote = (id) => {
        setEditData(emoteData.find((emote)=> emote.id ==id));
        setPage('emotionInsert');
    };
    const deleteEmote = (id) => {
        let delOk=confirm("삭제하시겠습니까?");
        if (delOk==true){
            setEmoteData(emoteData.filter((emote) => emote.id !== id));
        }
        else return;
    };

    return (
        <div>
            <h1>감정 기록 &nbsp;
                <button
                    onClick={() => setPage('emotionInsert')}>추가</button>
                &nbsp;
                <button 
                    onClick={() => setPage('main')}>이전 화면</button>
            </h1><hr width='750px' align='left' />

            <table>
                <tr align='center' height='45px'>
                    <th width='100px' height='10px'>날짜</th>
                    <th width='100px'>평균 기분</th>
                    <th width='200px'>Best Thing<img src="/icon/best.jpg" width='30px' /></th>
                    <th width='200px'>Worst Thing<img src="/icon/worst.jpg" width='30px' /></th>
                    <th width='100px'>비고</th>
                </tr>
                {emoteData.map((emote) => (
                    <tr  key={emote.id} align='center' height='40px'>
                        <td>{emote.date}</td>
                        <td>{emote.avg}</td>
                        <td>{emote.best}</td>
                        <td>{emote.worst}</td>
                        <td>
                            <button onClick={() => deleteEmote(emote.id)}>삭제</button>
                            &nbsp;
                            <button onClick={() => editEmote(emote.id)}>수정</button>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
};


const EmotionInsert = ({setPage,emoteData,setEmoteData,editData,setEditData}) => {
    const [items,setItems]=useState([]);
    const [checkItems,setCheckItems]=useState([]);
    const [title,setTitle]=useState('');
    const [date,setDate]=useState('');
    const textUi=useRef();

    useEffect(() => {
        if (items.length==0 && !date){
            setDate(new Date().toISOString().split("T")[0]);
        }
        if (editData){
            setItems(editData.details);
            setDate(editData.date);
        }
    },[editData]);

    const addItem=(text)=>{
        if (!title){
            alert("내용을 입력해주세요!");
            textUi.current.focus();
            return;
        }
        const newItem={id:items.length+1,text,score:3};
        setItems([...items,newItem]);
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
            <h1>감정 추가 &nbsp;
            <button onClick={dontSave}>이전</button>
            </h1><hr width='750px' align='left' />

            <table>
                <tr height='30px'>
                    <th width='75px'>날짜</th>
                    <td>
                        <input type='date' value={date} onChange={dateChange} />
                    </td>
                </tr>
                <tr height='30px'>
                    <th>사건 추가</th>
                    <td>
                        <input type='text' placeholder='작성 후 엔터 or 버튼' 
                            value={title}
                            ref={textUi}
                            onKeyDown={(evt)=>{
                                if (evt.key=='Enter'){
                                    addItem(title);
                                }
                            }}
                        onChange={(evt)=>{setTitle(evt.target.value)}} /> &nbsp;
                        <button onClick={()=>{addItem(title);}}>추가</button>
                    </td>
                </tr>
            </table><hr width='750px' align='left' />
            
            <table>
                {items.map((item)=>(
                    <tr key={item.id}>
                        <td width='250px'>
                            <label>
                                <input type='checkbox' onChange={()=>checkChange(item.id)} />{item.text}
                            </label>
                        </td>
                        <td width='80px'>
                            <label>
                                <input type='radio' name={`score-${item.id}`} value='1' onChange={()=>scoreChange(item.id,1)} checked={item.score == 1} />
                                <span>1점</span>
                                <img src="/icon/worst.jpg" width='30px'/>
                            </label>
                        </td>
                        <td width='80px'>
                            <label>
                                <input type='radio' name={`score-${item.id}`} value='2' onChange={()=>scoreChange(item.id,2)} checked={item.score == 2} />
                                <span>2점</span>
                                <img src="/icon/bad.jpg" width='30px'/>
                            </label>
                        </td>
                        <td width='80px'>
                            <label>
                                <input type='radio' name={`score-${item.id}`} value='3' onChange={()=>scoreChange(item.id,3)} checked={item.score == 3} />
                                <span>3점</span>
                                <img src="/icon/soso.jpg" width='30px'/>
                            </label>
                        </td>
                        <td width='80px'>
                            <label>
                                <input type='radio' name={`score-${item.id}`} value='4' onChange={()=>scoreChange(item.id,4)} checked={item.score == 4} />
                                <span>4점</span>
                                <img src="/icon/good.jpg" width='30px'/>
                            </label>
                        </td>
                        <td width='80px'>
                            <label>
                                <input type='radio' name={`score-${item.id}`} value='5' onChange={()=>scoreChange(item.id,5)} checked={item.score == 5} />
                                <span>5점</span>
                                <img src="/icon/best.jpg" width='30px'/>
                            </label>
                        </td> 
                    </tr>
                ))}
            </table><hr width='750px' align='left' />

            <div>
                <strong>평균 점수 : {calAvgScore(items)}</strong>
                &nbsp;
                <button onClick={deleteItem} >삭제</button>
                &nbsp;
                <button onClick={saveEmote}>저장</button>
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
            <h1>To Do List &nbsp;
                <button onClick={() => setPage('todoInsert')}>추가/수정</button>
                &nbsp;
                <button onClick={() => setPage('main')}>이전 화면</button>
            </h1>
            <strong>완료 현황: {checkedCount}/{totalCount}</strong>
            <hr width='750px' align='left' />

            <table>
                <tr align='center' height='35px'>
                    <th width='80px'>완료</th>
                    <th width='150px'>카테고리</th>
                    <th width='200px'>할 일</th>
                </tr>
                {todoData.map((todo) => (
                    <tr key={todo.id} align='center' height='30px'>
                        <td>
                            <input
                                type="checkbox"
                                checked={todo.checked || false}
                                onChange={() => CheckboxChange(todo.id)}
                            />
                        </td>
                        <td style={{textDecoration:todo.checked ? 'line-through 2px red' :'none'}}>{todo.category}</td>
                        <td style={{textDecoration:todo.checked ? 'line-through 2px red' :'none'}}>{todo.text}
                        </td> 
                    </tr>
                ))}
            </table>
        </div>
    );
};

const TodoInsert = ({setPage,todoData,setTodoData}) => {
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
            checked: false,
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
            <h1>할 일 추가 &nbsp;
                <button onClick={()=>setPage('todoHome')}>이전</button>
            </h1><hr width='750px' align='left' />

            <table>
                <tr>
                    <th>카테고리</th>
                    <td>
                        <select name='category' value={cate} onChange={(evt)=>setCate(evt.target.value)}>
                            <option value="">선택</option>
                            <option value='중요'>중요</option>
                            <option value='일상'>일상</option>
                            <option value='공부'>공부</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>Task</th>
                    <td>
                        <input type='text' placeholder='할 일 입력'
                        value={title} ref={textUi}
                        onKeyDown={(evt)=>{
                            if (evt.key=='Enter'){
                                addTodo(title);
                            }
                        }}
                        onChange={(evt)=>{setTitle(evt.target.value)}} />
                        &nbsp;
                        <button onClick={()=>{addTodo(title)}}>입력</button>
                    </td>
                </tr>
            </table><hr width='750px' align='left' />

            <table>
                {todoData.map((todo) => (
                    <tr key={todo.id} height='28px'>
                        <td>
                            <label>
                                <input type="checkbox" onChange={() => checkChange(todo.id)} />
                                &nbsp;
                                {todo.category} - {todo.text}
                            </label>
                        </td>
                    </tr>
                ))}
            </table> <hr width='750px' align='left' />

            <button onClick={deleteTodo}>삭제</button>
            &nbsp;
            <button onClick={saveTodo}>저장</button>
        </div>
    )
};

export default function Final() {
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
