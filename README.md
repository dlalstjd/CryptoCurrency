## Hexlant 
Hexlant 산학 일지  
---
2020.
---
# 7. 6. Mon : 간단한 request 예제  
1. openAPI
- API(Application Programming Interface)  
- _**응용프로그램**에서 사용할 수 있도록, **운영체제나 프로그래밍 언어가 제공하는 기술**을 제어할 수 있게 만든 인터페이스_  
- UI가 사용자와 대상을 연결한다면, API는 서로 다른 프로그램 사이를 연결해주는 다리,,
- **응용프로그램**이 우리가 만든 application이라면 **운영체제나 프로그래밍 언어가 제공하는 기술**은 sk 날씨정보나 카카오페이!!
- openAPI는 말그대로 **open**돼있는 API  

![0](./images/remain_mask_openAPI.PNG)    
- dictionary 형태로 값들이 들어있는 걸 확인할 수 있음!!  
  
---
2. python 가상환경(virtual environment)  
- 여러 프로젝트 개발 시 패키지 호환문제 발생,, 이를 해결하기 위해 python에서는 가상환경을 제공해 독립된 공간을 제공  

```
// 마지막 인자 venv는 파일 이름으로 변경 가능  
window: python -m venv venv
```  
- 만약 에러("...스크립트를 실행할 수 없다...")가 발생한 경우

```
Set-ExecutionPolicy Unrestricted -Scope CurrentUser
```

- 위 command 입력 후 다시 실행. 이걸로 해결안되면 Set-ExecutionPolicy Unrestricted같은 다른 command 사용,,  
---  
3. request library
- python에서 HTTP requeset를 처리할 수 있는 묘듈

```
pip install requests
```    

  
---
4. example (source code: openAPI_request.py)  
```
r = requests.get('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json')
rjson = r.json()
stores = rjson['stores']
for store in stores:
    try:
        if store['remain_stat'] == 'plenty':
            print(store['addr'],store['name'])
    except:
        continue
```  

```
서울특별시 강남구 논현로95길 29-13 2층 (역삼동) 경희자연한약국  
서울특별시 강남구 논현로 561 1층 (역삼동) 비타약국  
서울특별시 강남구 논현로 503 703-1호 (역삼동, 송촌빌딩) 세코아약국  
서울특별시 강남구 논현로 509 1층 1호 (역삼동) 팜스약국  
서울특별시 강남구 논현로 511 3층 (역삼동, YandC빌딩) 다정온누리약국  
서울특별시 강남구 논현로 521-3 1층 (역삼동) 역삼다인약국      
서울특별시 강남구 테헤란로28길 5 1층 일부호 (역삼동) 샬롬온누리약국  

중략,,,

``` 
---  
# 7. 7. Tue : 간단한 Django project
1. Django
- Django는 웹 개발에 사용되는 python web framework,,
- 본격적으로 시작하기 전, Django를 설치해야 함
```
python -m pip install django  
```
---
2. Django Project 생성
- 아래 command로 project 생성
'''  
django-admin startproject web_project .
'''
- startproject는 현재 폴더에 project를 생성함을 의미.  
- ~~원래 마지막 . 을 찍어야 된다는데 나는 안찍었던 것 같은데 잘됐다,,~~  
- web_project는 project이름,,  
- command 입력하면 web_project 폴더가 생기는데 안에 python file은 차차 알아볼 것. 일단 작동 방식은 아래와 같음.  

![0](./images/how_django_work.png)  

- **가상환경이 활성화 돼있는지 꼭 확인할 것!!**  
---
3. server 실행
- 아래 command로 server 실행
```
#default로 port가 8000
python manage.py runserver

#port값을 변경하고 싶다면 맨 뒤에 option값 추가
python manage.py runserver 5000
```  


- **아니 근데 오류 발생,,**
- 우선 터미널에 나온대로 python manage.py migration 해줘도 오류가 발생함  
- 오류를 보니까 server를 여는 과정에서 hostname을 받아오는데 이때 **UnicodeDecodeError**가 발생  
- hostname이 한글로 돼있어서 발생하는 문제;; 아래 명령어를 cmd에 입력해 hostname을 바꿔야함.  
```
wmic ComputerSystem Where Name="%COMPUTERNAME%" Call Rename Name="원하는 호스트 명 영어로,,"  

결과값으로 ReturnValue = 0이 아니라면 hostname이 바뀌지 않은 것!
```
- 본인은 바뀌지가 않아서 직접 바꿔주었다.

```
제어판 >> 시스템 및 보안 >> 시스템 >> 설정 변경 >> 변경  
에서 직접 이름 변경

```
- **변경 후 재부팅해서 적용됨**
- 실행 후 터미널에 http://127.0.0.1:8000/을 타고 들어가면 아래 화면을 확인할 수 있음~!  
![0](./images/initialpage.PNG)  

---
4. Django app 생성
- 본격적으로 web을 꾸려보자  
```
#hello는 app이름( 변경가능 )
python manage.py startapp hello
```
- web_project 파일 아래 hello 파일이 생긴 걸 확인할 수 있음  
- views.py는 내 web application의 page를 정의  
<br>

- hello/urls.py 파일 만들기
```
from django.urls import path
from hello import views

urlpatterns = [
    path("", views.home, name = "home"),
]
```
- 여기서 내 web application의 route을 정의해주는 것
- 첫번 째인자는 route에 해당
- 여기서는 URL pattern을 빈 문자열에 매칭
- **Django URL resolver는 전체 URL pattern에서 prefix에 포함된 도메인 네임을 무시!!** 따라서 해당 route는 http://127.0.0.1:8000/에 대응
- 두번째 인자인 views.home은 views에 정의된 함수 home을 해당 url path로 이동했을 때 불러옴. **즉 http://127.0.0.1:8000/에 접속했을 때, views.home을 띄어주는 것!!**
- [세번 째 인자](https://docs.djangoproject.com/en/3.0/topics/http/urls/#naming-url-patterns)는 URL reversing에 쓰인단다,,
<br>

- views.home
```
def home(request):
    return HttpResponse("Hello, Django!")
```
- hello/views.py안에 "Hello, Django!"라는 content을 response해주는 간단한 view를 정의함  
- 결과창~!~!  
![0](./images/init_result.PNG)  

---
5. Explore
- hello/urls.py에 rouute 추가
- **추가할 때 ","로 추가,,,**
```  
path("hello/<name>", views.hello_there, name="hello_there")
```
- route에서 hello/뒤에 name을 string 변수로 받아와 route를 정의한다.
- 즉 http://127.0.0.1:8000/hello/_name_ 으로 route 정의
- **route는 case sensitive!!**  

- 여기서 name을 어디서 받아오는 건지 약간 헷갈렸으나 주소값 입력에서 hello/뒤에 붙은 값을 name이라는 변수로 받아오는 것!
- 다시말해 http://127.0.0.1:8000/hello/hexlant 로 받았다면 hexlant가 name으로 넘어오는 것.
- 따라서 **re.match해줘야 함**. user-provided information에 HTML의 control charactor 등이 들어가 문제가 생길 수 있음
- 때문에 filter해주는 작업이 필요,,!
- 아래는 views.hello_there
```
def hello_there(requset, name):

    중략,,  

    match_object = re.match("[a-zA-Z]+", name)

    중략,,  
```  
- name을 hello_there에서 인자로 받아옴

---
6. Template
- plane한 text web page를 바꿔보자
- content = "'<h1>'Hello there"!'<h1>'과 같이 HTML을 활용해 직접 전달할 경우 [cross-site scripting(XSS) attacks](https://en.wikipedia.org/wiki/Cross-site_scripting)에 위험
- 따라서 template을 활용하는 것!