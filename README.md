CONTEXT
--------

закончил роутинг 29.01
методы жизненного цикла компонента:
componentDidMount(),
render(),
componentDidUpdate(),
componentWillUnmount(),
componentDidCatch()
//-------------------------------------------------------//
componentDidMount() - компонент подключен (DOM элементы уже на странице), 
используется для инициализации(получение данных с API, работа с DOM, и т.д.)
Нельзя использовать конструктор для кода который создает побочные эффекты, 
state и methods можно инициализировать без конструктора до componentDidMount()
//-------------------------------------------------------//

componentDidUpdate() - метод который используется при обновлении существующего стейта или пропса, вызывается после рендера, 
принимает 2 аргумента (prevProps, prevState), и обновляет предидущие пропсы и стейты, при этом необходимо учитывать что
componentDidMount() сразу при загрузке приложения производит первое обновление, а все последующие уже происходят в componentDidUpdate(), 
допустим мы кликнули по кнопке и стейт или пропсы изменились, занчит Update. Обязательно нужно помнить что в этой функции действия необходимо оборачивать 
в условие, которое сравнивает преидущее и нынешнее состояние стейта или пропса, если не делать сравнение, то цикл статнет бесконечным.
state = { person: null }

  componentDidMount() { this.updatePerson(); }
  componentDidUpdate(prevProps) {
    if (this.props.personId !== prevProps.personId) {
      this.updatePerson();
    }
  }
  updatePerson() {
    const { personId } = this.props;
    if (!personId) {return;}
    this.swapiService
      .getPerson(personId)
      .then((person) => {
        this.setState({ person });
      })
  }

//-------------------------------------------------------//
componentWillUnmount()- метод для очистки ресурсов(таймеры, инервалы, запросы к серверу),
 перед удалением DOM элементов, (допустим очистка при setIntervsal), в момент вызова DOM все еще
находится на странице 
//-------------------------------------------------------//
componentDidCatch()-нужен для обработки ошибок вышеперечисленных методов.Отлавливает ошибки ниже по иерархии и в зависимости от размещения данного компонента происходят следущие события:
если на самом верху- то при нахождении ошибки на любом уровне происходит удаление всего DOM,
но если компоненты независимы то можно разместить этот метод на верхнем уровне каждого род компонента, и тогда при ошибке на каком либо уровне, ошибка поднимется до ближайшего componentDidCatch()
и удалится только та часть на которой произошла ошибка- Error boundry, границы ошибок, этот метод работает только в методах жизненного цикла, не работает в ассинхронных колбеках и eventListener, даже если они 
были взваны в методах жизненного цикла, 
Чтобы определить границы ошибок, нужны компоненты которые будут разделять независимые блоки приложения, короче нужно создать отдельный компонент, 
который обернет в единный блок независимые компоненты, и в этом род блоке уже использовать метод componentDidCatch()
этот метод принимает два аргумента, error / info, 

Render- its a function!!!!!

Routing
необходимо установить: npm install react-router, npm install react-router-dom
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
 обернуть все компоненты в <Router> <Route exact path='/path' component={ComponentName}</Router>
exact-точное совпадение

Link
import { Link} from 'react-router-dom';
<Link to='/path'>Title</Link>

Render in routing? if you need to add sothing, 
<Route path="/" render={()=><h2>Welcome to star DB</h2>}/>
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
Динамические пути:
если нужно сделать вывод предварительной информации элемента компонента и затем вывести полную инфо элемента, используют динамиечкие пути.

в Route можно передавать параметры: на примере кораблей на главную страницу кораблей выводится список, а уже по клику на элемент
выводится полная инфо элемента
<Route path="/starships" exact component={StarshipsPage} />
              <Route path="/starships/:id" render={({ match }) => {
                const { id } = match.params
                return <StarshipDetails itemId={id} />
              }} />
:id - может быть любой строкой которая идет после /starships/: обязательно нужно установить exact

необходимо использовать на том компоненте который нужно отразить withRouter()
- это компоннет высшего порядка, он передает компоненту объекты react router
import { withRouter } from 'react-router-dom'

const StarshipsPage = ({ history }) => {

  return (
    <StarshipList onItemSelected={(itemId) => {
      const newPath = `/starships/${itemId}`;
      history.push(newPath)
    }} />

  );
}
export default withRouter(StarshipsPage);
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

Отночительные пути:

/name/- это папка - относительный путь
/name - это файл - абсолютный путь

Можно использовать относительные пути, но!!!
const StarshipsPage = ({ history }) => {

  return (
    <StarshipList onItemSelected={(itemId) => {    
      history.push(itemId)
    }} />
  );
}

!!Необходимо в компоненте список элементов превратить в папки, тоесть добавить после /starships еще один "/"
<Link to="/starships/">Starships</Link>
        </li>

[+++++++++++++++++++++++++++++++++++++++++++++++++]

Switch

Компонент Switch оборачивает другие компоненты (Route, Redirect)
Он отрисовывает только первый элеемнт который соотвествует адресу(если компонентов несколько с одинаковым адресом)

Route без свойства path срабатывает всегда - в случае если пользователем введена неправильная ссылка можно сделать перенаправление
<Route render={()=> <h2>Page not found<h2>}


[+++++++++++++++++++++++++++++++++++++++++++++++++]
Опциональные параметры:
в path параметры могут быть опциональными:
<Route path ="/name/:id?"
Приложение должно позволять перезагружать страницы или пердавать URL другим пользователям
Адресс должен содержать  ID открытого элемента (тогда открыв URL пользователь попадет на тот же экран)



Сохранение пути при перезагрузке страницы:
добавить к пути /:id?- <Route path="/people/:id?" component={PeoplePage} />
и 
непосредственно в самом компоненте:
import { withRouter } from 'react-router-dom'

const PeoplePage = ({ history, match }) => {
  const { id } = match.params;
  return (
    <Row
      left={<PersonList onItemSelected={(id) => history.push(id)} />}
      right={<PersonDetails itemId={id} />} />
  );
}
export default withRouter(PeoplePage);
[+++++++++++++++++++++++++++++++++++++++++++++++++]

Защищенные страницы- ЛОГИН
на простейщем уровне и только для user experience можно использовать Redirect, что бы перслать пользователя на логин-страницу:
<Redirect to="/login"/>
Hooks - альтернатива компонентам высшего порядка

Хуки дают возможность функциональным компонентам работать с состоянием, жизненым циклои и контекстом
useState()

const [color, setColor]=useState("white")
const [age, setAge]=useState(25)
Возвращает массив: текущее значение и функция для установки нового значения
Всегда обновляет объект полностью, а не отдельные поля как setState()
[+++++++++++++++++++++++++++++++++++++++++++++++++]
useContext()
*получает значение из заданного контекста
const a=useContext(ContextA)
*код создания контекста и установки значения остается без изменений
* в useContext передается именно объект-контекст (а не Consumer):
const MyContext = React.createContext();

const App = () => {
  return (
    <MyContext.Provider value="hello 123">
      <Child />
    </MyContext.Provider>
  )
}
const Child = () => {
  const value = useContext(MyContext)
  return (
    <p>{value}</p>
  )
}
[+++++++++++++++++++++++++++++++++++++++++++++++++]

useEffect()- схож с жизненными циклами в классах, регистрирует функцию у которой могут быть побочные эффекты,
 срабатывает когда комнонент появляется на экране, аналогично didMount, а также вызывается когда компонент обновляется, это 
комбинация между didMount и didUpdate
useEffect()принимает два аргумента, непосредственно функцию которая производит действие и вторым аргументом массив с данными которые возможно должны
изменяться (если передать пустой массив, то функция будет вызвана только один раз, подобно didMount ). в отлии от классового didMount сравнивать предидущее
 и новое значение не нужно, функция это делает сама.
если же нужно после действия очищать историю предидущих действий, то это делается внутри как вторая возвратная функция и при очистке данная функция срабатывает как willUnmount

const App = () => {
  const [value, setValue] = useState(0)
  const [visible, setVisible] = useState(true)

  if (visible) {
    return ( <div>
        <button onClick={() => setValue((v) => v + 1)}>+</button>
        <button onClick={() => setVisible(false)}>hide</button>
        <ClassCounter value={value} />
        <HookCounter value={value} /> </div>)
  } else { return <button onClick={() => setVisible(true)}>show</button>}
}

const HookCounter = ({ value }) => {
  useEffect(()=>{ onsole.log('useEffect')
    return ()=>console.log('clear')
  }, [value])
  return <p>{value}</p>}

class ClassCounter extends React.Component {
  componentDidMount() { console.log('class: mount')}

  componentDidUpdate() {console.log('class: update')}
  componentWillUnmount() {console.log('class: UNmount')}
  render() {return (<p>{this.props.value}</p>)}}

[+++++++++++++++++++++++++++++++++++++++++++++++++]

API - useEfefct():

   const [name, setName] = useState(null)
 useEffect(() => {
     let cancelled = false;
     fetch(`https://swapi.dev/api/planets/${id}/`)
       .then(res => res.json())
       .then(data => !cancelled && setName(data.name))
     return () => cancelled = true;
  }, [id])

[+++++++++++++++++++++++++++++++++++++++++++++++++]
Хуки нельзя использовать в циклах и условиях
Хуки можно использовать только в React компонентах и в других хуках
Хуки нельзя использовать в классах

ComponentDidCatch()-работает только в классах