const elementsData1 = [
	{
		name: '1',
		content: [],
	},
	{
		name: 'CIĄGI KOMUNIKACYJNE',
		content: [
			'1.1.1.Równy chodnik, brak wysokich krawężników i przeszkód',
			'1.1.2.Kontrastowe i antypoślizgowe materiały wykończeniowe ułatwiające orientację i poruszanie się',
			'1.1.3.Wyposażenie, miejsca odpoczynku, siedzenia i elementy małej architektury znajdują się poza szerokością 1,8 m (główna trasa dojścia do budynku)',
			'1.1.4.Minimalna szerokość ciągi komunikacyjne: 150 cm (oddzielone od jezdni) 200 cm (przy jezdni)',
			'1.1.5.W ciągach pieszych o szerokości poniżej 180 cm i długości powyżej 50 m  miejsca mijania o długości 200 cm i szerokości 180 cm co 25 m',
			'1.1.6.Ścieżki rowerowe wyraźnie oddzielone od chodnika',
			'1.1.7.Podkreślenie głównych ciągów komunikacyjnych za pomocą faktury materiału, zastosowanie ścieżek dotykowych',
		],
	},
	{
		name: 'SCHODY ZEWNĘTRZNE',
		content: [
			'1.2.1.Ilość stopni w jednym biegu poniżej 10',
			'1.2.2.Szerokość: biegu 1,2 m, spocznika 1,5 m',
			'1.2.3.Głębokość stopni min. 35 cm, wysokość stopni max. 17,5 cm',
			'1.2.4.Powierzchnie spoczników schodów mają wykończenie wyróżniające je odcieniem, barwą bądź fakturą, min. w pasie 30 cm od krawędzi rozpoczynającej i kończącej bieg schodów',
		],
	},
	{
		name: 'WYPOSAŻENIE ZEWNĘTRZNE',
		content: [
			'1.3.1.Ławki wyposażone w oparcia i podłokietniki (przynajmniej 1/3 miejsc siedzących)',
			'1.3.2.Zapewniono miejsca postojowe dla rowerów',
		],
	},
	{
		name: 'OZNACZENIA I TABLICE INFORMACYJNE',
		content: [
			'1.4.1.Czytelne oznaczenia w języku symbolicznym lub obrazkowym',
			'1.4.2.Czytelne tablice informacyjne w języku symbolicznym lub obrazkowym',
		],
	},
	{
		name: 'OŚWIETLENIE ZEWNĘTRZNE',
		content: [
			'1.5.1.Trasa dojścia do budynku jest dobrze oświetlona',
			'1.5.2.Rozstaw opraw oświetleniowych umożliwia równomierną dystrybucję światła',
		],
	},
]

const elementsData2 = [
	{
		name: 'LOKALIZACJA STANOWISK POSTOJOWYCH',
		content: [
			'2.1.1.Zalecana ilość miejsc postojowych dla OZN przy ogólnej liczbie miejsc postojowych: 1 przy 6-15, 2 przy 16-40, 3 przy 41-100, 4% przy ponad 100',
			'2.1.2.Odległość miejsc postojowych dla OZN od wejścia jest minimalna',
			'2.1.3.W celu wspomagania osób z niepełnosprawnością wzroku wymaga się, aby systemy prowadzenia wyróżniały się kolorystycznie z tła',
			'2.1.4.Zapewnienie dostępu do chodnika bez stopni i przeszkód',
		],
	},
	{
		name: 'STANOWISKA POSTOJOWE',
		content: [
			'2.2.1.Równa i gładka o prawidłowym spadku podłużnym i poprzecznym',
			'2.2.2.Wykonana z odpowiedniego materiału',
			'2.2.3.Odpowiednie oznaczenie  poziome (niebieskie tło, opcjonalnie znak poziomy p 20 "koperta" i/lub znak poziomy p 24 "miejsce dla pojazdu osoby niepełnosprawnej"',
			'2.2.4.Odpowiednie oznaczenie pionowe (znak pionowy d-18a "parking - miejsce zastrzeżone" wraz z tabliczką t 29 informująca o miejscu dla osoby niepełnosprawnej',
			'2.2.5.Wskaźnik odbicia światła słonecznego w wartości co najmniej 0,33',
			'2.2.6.Wielkość 360x500 cm lub 360x600 cm (w przypadku stanowisk postojowych usytuowanych wzdłuż jezdni)',
		],
	},
]

/*
  3.1.	Otoczenie strefy wejścia
3.1.1.	Przed wejściem nawierzchnia utwardzona i antypoślizgowa o nachyleniu nie większym niż 6% 
3.1.2.	Przestrzeń manewrowa o wymiarach 150 na 150 cm
3.1.3.	Wycieraczka na poziomie chodnika lub jej wysokość jest mniejsza niż 1 cm, gumowa lub metalowa trwale przymocowana, o oczkach nie większych niż 2 cm
3.1.4.	Oprawy oświetleniowe zainstalowane bezpiecznie dla użytkowników
3.1.5.	Odpowiednie oświetlenie wejścia
3.1.6.	Wyposażenie w pochylnie do pierwszej kondygnacji w przypadku braku dźwigu osobowego
3.1.7.	Zapewnienie wizualnych, słuchowych i dotykowych form prowadzenia w bardzo skomplikowanych przestrzeniach, w celu wspierania orientacji i wyboru odpowiedniego kierunku
3.2.	Drzwi
3.2.1.	O szerokości min. 90 cm, w przypadku dwuskrzydłowych główne skrzydło o szerokości min. 90 cm
3.2.2.	Próg max 2 cm, ze ściętym klinem, w wyróżniającym się kolorze
3.2.3.	Są automatyczne
3.2.4.	Są lekkie i łatwe w obsłudze
3.2.5.	Klamka, zamek oraz dzwonek łatwe w identyfikacji oraz umieszczone na wysokości 80 - 120 cm nad poziomem podłogi
3.2.6.	Ściana od strony otwierania drzwi oddalona jest o min 60 cm
3.2.7.	W przypadku drzwi obrotowych lub wahadłowych towarzyszą im drzwi rozwierane lub przesuwne
3.2.8.	Prześwit wolny od przeszkód o szerokości 90 cm
3.2.9.	Przestrzeń manewrowa w wiatrołapie: minimum 150x150 cm, poza polem otwierania skrzydła drzwi
3.3.	Daszek/podcień ochronny lub pomieszczenie przedsionka
3.3.1.	Szerokość min. 100 cm większa niż drzwi
3.3.2.	Głębokość lub wysięg: min. 100 cm (budynki do 12 m), 150 cm (budynki od 12 m)
3.3.3.	Umieszczony na wysokości min. 230 cm
  */

const elementsData3 = [
	{
		name: 'OTOCZENIE STREFY WEJŚCIA',
		content: [
			'3.1.1.Przed wejściem nawierzchnia utwardzona i antypoślizgowa o nachyleniu nie większym niż 6%',
			'3.1.2.Przestrzeń manewrowa o wymiarach 150 na 150 cm',
			'3.1.3.Wycieraczka na poziomie chodnika lub jej wysokość jest mniejsza niż 1 cm, gumowa lub metalowa trwale przymocowana, o oczkach nie większych niż 2 cm',
			'3.1.4.Oprawy oświetleniowe zainstalowane bezpiecznie dla użytkowników',
			'3.1.5.Odpowiednie oświetlenie wejścia',
			'3.1.6.Wyposażenie w pochylnie do pierwszej kondygnacji w przypadku braku dźwigu osobowego',
			'3.1.7.Zapewnienie wizualnych, słuchowych i dotykowych form prowadzenia w bardzo skomplikowanych przestrzeniach, w celu wspierania orientacji i wyboru odpowiedniego kierunku',
		],
	},
	{
		name: 'DRZWI',
		content: [
			'3.2.1.O szerokości min. 90 cm, w przypadku dwuskrzydłowych główne skrzydło o szerokości min. 90 cm',
			'3.2.2.Próg max 2 cm, ze ściętym klinem, w wyróżniającym się kolorze',
			'3.2.3.Są automatyczne',
			'3.2.4.Są lekkie i łatwe w obsłudze',
			'3.2.5.Klamka, zamek oraz dzwonek łatwe w identyfikacji oraz umieszczone na wysokości 80 - 120 cm nad poziomem podłogi',
			'3.2.6.Ściana od strony otwierania drzwi oddalona jest o min 60 cm',
			'3.2.7.W przypadku drzwi obrotowych lub wahadłowych towarzyszą im drzwi rozwierane lub przesuwne',
			'3.2.8.Prześwit wolny od przeszkód o szerokości 90 cm',
			'3.2.9.Przestrzeń manewrowa w wiatrołapie: minimum 150x150 cm, poza polem otwierania skrzydła drzwi',
		],
	},
	{
		name: 'DASZEK/PODCIEŃ OCHRONNY LUB POMIESZCZENIE PRZEDSIONKA',
		content: [
			'3.3.1.Szerokość min. 100 cm większa niż drzwi',
			'3.3.2.Głębokość lub wysięg: min. 100 cm (budynki do 12 m), 150 cm (budynki od 12 m)',
			'3.3.3.Umieszczony na wysokości min. 230 cm',
		],
	},
]

/*
4.1.	Szerokość , długość i  spoczniki
4.1.1.	Pochylnie powinny mieć szerokość płaszczyzny ruchu minimum 120 cm
4.1.2.	W odległości 50 cm przed wejściem
4.1.3.	"Pochylnie o długości ponad 9 m powinny być podzielone na krótsze odcinki,
Przy zastosowaniu spoczników o długości co najmniej 140 cm (zalecane 200 cm)"
4.1.4.	Szerokość spocznika nie może być mniejsza niż szerokość biegu pochylni
4.1.5.	"Jeżeli na spoczniku następuje zmiana kierunku należy zapewnić na nim powierzchnię
Manewrową o minimalnych wymiarach 150x150 cm (zalecane 200x200 cm),"
4.1.6.	"W dużych obiektach użyteczności publicznej  zaleca się stosowanie większych spoczników o wymiarach 210x210 cm, tak aby zapewnić odpowiednią powierzchnię manewrową dla jak najszerszej grupy
Użytkownik w np. Korzystających ze skuterów elektrycznych"
4.1.7.	"Długość poziomej płaszczyzny na początku i na końcu pochylni powinna wynosić
Co najmniej 150 cm, poza polem otwierania drzwi"
4.1.8.	"Pochylnia powinna zawierać krawężniki o wysokości od 7 cm do 10 cm, w celu uniknięcia
Niekontrolowanego zjazdu wózka."
4.1.9.	"Nawierzchnia pochylni powinna zapewnić możliwość swobodnego poruszania się,
Tzn. Powinna być twarda, równa i mieć powierzchnię antypoślizgową"
4.2.	Nachylenie
4.2.1.	Różnica wysokości do 15 cm -  max nachylenie 15% (wewnętrzne lub pod daszkiem)
4.2.2.	Różnica wysokości do 50 cm -  max nachylenie 10% (wewnętrzne lub pod daszkiem)
4.2.3.	Różnica wysokości powyżej 50cm -  max nachylenie 8% (wewnętrzne lub pod daszkiem)
4.2.4.	Różnica wysokości do 15 cm -  max nachylenie 15% (na zewnątrz)
4.2.5.	Różnica wysokości do 50cm -  max nachylenie 10% (na zewnątrz)
4.2.6.	Różnica wysokości powyżej 50cm -  max nachylenie 6% (na zewnątrz)
4.3.	Poręcze
4.3.1.	Po obu stronach pochylni należy zainstalować poręcze na wysokości 75 i 90 cm
4.3.2.	Odstęp między poręczami musi mieścić się w granicach od 100 cm do 110 cm
4.3.3.	"Poręcze przy pochylniach należy przedłużyć o 30 cm na ich początku,
Końcu oraz zakończyć w sposób zapewniający bezpieczne użytkowanie"
4.3.4.	Poręcze przy pochylniach powinny być równoległe do nawierzchni
4.3.5.	Część chwytna poręczy powinna mieć średnicę 3,5 - 4,5 cm
4.3.6.	Część chwytna poręczy powinna być oddalona od ściany o co najmniej 5 cm
4.4.	oznaczenia
4.4.1.	Na końcach poręczy oznaczenie dotykowe w alfabecie braille'a i/lub pismo wypukłe
4.4.2.	"Powierzchnie spoczników pochylni powinny mieć wykończenie wyróżniające je odcieniem,
Barwą bądź fakturą, co najmniej w pasie 30 cm od krawędzi rozpoczynającej i kończącej
Bieg pochylni"
*/

const elementsData4 = [
	{
		name: 'Szerokość , długość i  spoczniki',
		content: [
			'4.1.1.Pochylnie powinny mieć szerokość płaszczyzny ruchu minimum 120 cm',
			'4.1.2.W odległości 50 cm przed wejściem',
			'4.1.3."Pochylnie o długości ponad 9 m powinny być podzielone na krótsze odcinki, Przy zastosowaniu spoczników o długości co najmniej 140 cm (zalecane 200 cm)"',
			'4.1.4.Szerokość spocznika nie może być mniejsza niż szerokość biegu pochylni',
			'4.1.5."Jeżeli na spoczniku następuje zmiana kierunku należy zapewnić na nim powierzchnię Manewrową o minimalnych wymiarach 150x150 cm (zalecane 200x200 cm),"',
			'4.1.6."W dużych obiektach użyteczności publicznej  zaleca się stosowanie większych spoczników o wymiarach 210x210 cm, tak aby zapewnić odpowiednią powierzchnię manewrową dla jak najszerszej grupy Użytkownik w np. Korzystających ze skuterów elektrycznych"',
			'4.1.7."Długość poziomej płaszczyzny na początku i na końcu pochylni powinna wynosić Co najmniej 150 cm, poza polem otwierania drzwi"',
			'4.1.8."Pochylnia powinna zawierać krawężniki o wysokości od 7 cm do 10 cm, w celu uniknięcia Niekontrolowanego zjazdu wózka."',
			'4.1.9."Nawierzchnia pochylni powinna zapewnić możliwość swobodnego poruszania się, Tzn. Powinna być twarda, równa i mieć powierzchnię antypoślizgową"',
		],
	},
	{
		name: 'Nachylenie',
		content: [
			'4.2.1.Różnica wysokości do 15 cm -  max nachylenie 15% (wewnętrzne lub pod daszkiem)',
			'4.2.2.Różnica wysokości do 50 cm -  max nachylenie 10% (wewnętrzne lub pod daszkiem)',
			'4.2.3.Różnica wysokości powyżej 50cm -  max nachylenie 8% (wewnętrzne lub pod daszkiem)',
			'4.2.4.Różnica wysokości do 15 cm -  max nachylenie 15% (na zewnątrz)',
			'4.2.5.Różnica wysokości do 50cm -  max nachylenie 10% (na zewnątrz)',
			'4.2.6.Różnica wysokości powyżej 50cm -  max nachylenie 6% (na zewnątrz)',
		],
	},
	{
		name: 'Poręcze',
		content: [
			'4.3.1.Po obu stronach pochylni należy zainstalować poręcze na wysokości 75 i 90 cm',
			'4.3.2.Odstęp między poręczami musi mieścić się w granicach od 100 cm do 110 cm',
			'4.3.3."Poręcze przy pochylniach należy przedłużyć o 30 cm na ich początku, Końcu oraz zakończyć w sposób zapewniający bezpieczne użytkowanie"',
			'4.3.4.Poręcze przy pochylniach powinny być równoległe do nawierzchni',
			'4.3.5.Część chwytna poręczy powinna mieć średnicę 3,5 - 4,5 cm',
			'4.3.6.Część chwytna poręczy powinna być oddalona od ściany o co najmniej 5 cm',
		],
	},
	{
		name: 'Oznaczenia',
		content: [
			"4.4.1.Na końcach poręczy oznaczenie dotykowe w alfabecie braille'a i/lub pismo wypukłe",
			'4.4.2."Powierzchnie spoczników pochylni powinny mieć wykończenie wyróżniające je odcieniem, Barwą bądź fakturą, co najmniej w pasie 30 cm od krawędzi rozpoczynającej i kończącej Bieg pochylni"',
		],
	},
]

/*
5	Domofon
5.1.	Posiada system audio-wizualny
5.2.	Umieszczony w widocznym miejscu, po stronie klamki od drzwi, blisko wejścia
5.3.	W kontrastujących kolorach względem tła, na którym się znajduje
5.4.	Ekran domofonu  znajduje się nie wyżej niż 120 cm nad poziomem podłogi
5.5.	Przyciski na wysokości 80 - 110 cm i w odległości minimum 60 cm od narożnika wewnętrznego
5.6.	Przyciski dzwonków do drzwi o odpowiednio dużej wielkości i dają wizualny i dźwiękowy sygnał
5.7.	Posiada świetlne i dźwiękowe potwierdzenie otwierania zamka
5.8.	Posiada sygnalizację świetlną informującą  kiedy mogą zacząć mówić
5.9.	Przyciski w kontrastujących kolorach względem panelu na którym się znajdują
5.10.	Każdy przycisk posiada wyraźny numer lub literę w kolejności alfabetycznej, możliwy przez dotyk
5.11.	Klawisze zamiast systemu dotykowego (sensorycznego), z wyraźnym oznakowaniem klawiszy cyframi wypukłymi lub zastosowaniem międzynarodowej klawiatury z wyróżnieniem dotykowym cyfry „5”
5.12.	Kamerka domofonu  uchwyca  twarz osoby
5.13.	Instrukcja obsługi  łatwa do odnalezienia i odczytania – na wysokości max 120 cm 
*/
const elementsData5 = [
	{
		name: 'Domofon',
		content: [
			'5.1.Posiada system audio-wizualny',
			'5.2.Umieszczony w widocznym miejscu, po stronie klamki od drzwi, blisko wejścia',
			'5.3.W kontrastujących kolorach względem tła, na którym się znajduje',
			'5.4.Ekran domofonu  znajduje się nie wyżej niż 120 cm nad poziomem podłogi',
			'5.5.Przyciski na wysokości 80 - 110 cm i w odległości minimum 60 cm od narożnika wewnętrznego',
			'5.6.Przyciski dzwonków do drzwi o odpowiednio dużej wielkości i dają wizualny i dźwiękowy sygnał',
			'5.7.Posiada świetlne i dźwiękowe potwierdzenie otwierania zamka',
			'5.8.Posiada sygnalizację świetlną informującą  kiedy mogą zacząć mówić',
			'5.9.Przyciski w kontrastujących kolorach względem panelu na którym się znajdują',
			'5.10.Każdy przycisk posiada wyraźny numer lub literę w kolejności alfabetycznej, możliwy przez dotyk',
			'5.11.Klawisze zamiast systemu dotykowego (sensorycznego), z wyraźnym oznakowaniem klawiszy cyframi wypukłymi lub zastosowaniem międzynarodowej klawiatury z wyróżnieniem dotykowym cyfry „5”',
			'5.12.Kamerka domofonu  uchwyca  twarz osoby',
			'5.13.Instrukcja obsługi  łatwa do odnalezienia i odczytania – na wysokości max 120 cm ',
		],
	},
]

/*
6.1.	Położenie i wyposażenie
6.1.1	Recepcję / punkt informacyjny przewidziano w pobliżu wejścia
6.1.2.	Osoba obsługująca jest widoczna spoza lady
6.1.3.	Dla przynajmniej jednego stanowiska recepcji / punktu informacyjnego przewidziano blat recepcji o szerokości min. 0,9 m, o wysokości 0,8 m
6.1.4.	Dla przynajmniej jednego stanowiska recepcji / punktu informacyjnego przewidziano wolną przestrzeń na kolana osoby na wózku o minimalnych wymiarach 0,7 m wysokości x 0,6 m głębokości
6.1.5.	Zapewniono przestrzeń manewrową dla osoby na wózku o minimalnych wymiarach 1,5x1,5 m przed stanowiskiem
6.1.6.	Dla przynajmniej jednego stanowiska przewidziano wyposażenie w pętlę indukcyjną, a to stanowisko jest oznakowane symbolem
6.1.7.	Jeśli jest szyba to musi być demontowalne lub wyposażona w system głośnomówiący (interkom)
6.1.8.	Dojście do recepcji / punktu informacyjnego jest oznakowane zmienną fakturą lub systemem prowadzenia w posadzce
6.1.9.	Przejście do stanowisk o danej funkcji pozbawione jest przeszkód
6.1.10.	Tłumacz języka migowego online przy przynajmniej jednym stanowisku
6.2.	Oprawa oświetleniowa
6.2.1.	Główne wejście jest oświetlone
6.2.2.	Oświetlenie przedsionka gdy nie jest oświetlany światłem dziennym w czasie działania obiektu
6.2.3.	Oświetlenie jest zainstalowane bezpiecznie dla użytkowników
6.2.4.	Istotne przestrzenie są oświetlone w sposób równomierny
6.2.5.	Czujnik obecności lub sterowanie poprzez system BMS
6.2.6.	Jeśli stosuje się włączniki światła muszą one znajdować się na wysokości 80-120 cm.
6.2.7.	Włącznik światłą kontrastuje z kolorem tłą ściany min. 30 stopni w skali lrv 
6.2.8.	Oświetlenie jest min. 100 lx
6.2.9.	Żródło światła nie znajduje się w odpowiednim miejscu
6.2.10.	Światło naturalne wpadające do budynku jest regulowane za pomocą np.: żaluzji i innych urządzeń 
 */

const elementsData6 = [
	{
		name: 'Położenie i wyposażenie',
		content: [
			'6.1.1	Recepcję / punkt informacyjny przewidziano w pobliżu wejścia',
			'6.1.2.	Osoba obsługująca jest widoczna spoza lady',
			'6.1.3.	Dla przynajmniej jednego stanowiska recepcji / punktu informacyjnego przewidziano blat recepcji o szerokości min. 0,9 m, o wysokości 0,8 m',
			'6.1.4.	Dla przynajmniej jednego stanowiska recepcji / punktu informacyjnego przewidziano wolną przestrzeń na kolana osoby na wózku o minimalnych wymiarach 0,7 m wysokości x 0,6 m głębokości',
			'6.1.5.	Zapewniono przestrzeń manewrową dla osoby na wózku o minimalnych wymiarach 1,5x1,5 m przed stanowiskiem',
			'6.1.6.	Dla przynajmniej jednego stanowiska przewidziano wyposażenie w pętlę indukcyjną, a to stanowisko jest oznakowane symbolem',
			'6.1.7.	Jeśli jest szyba to musi być demontowalne lub wyposażona w system głośnomówiący (interkom)',
			'6.1.8.	Dojście do recepcji / punktu informacyjnego jest oznakowane zmienną fakturą lub systemem prowadzenia w posadzce',
			'6.1.9.	Przejście do stanowisk o danej funkcji pozbawione jest przeszkód',
			'6.1.10. Tłumacz języka migowego online przy przynajmniej jednym stanowisku',
		],
	},
	{
		name: 'Oprawa oświetleniowa',
		content: [
			'6.2.1.	Główne wejście jest oświetlone',
			'6.2.2.	Oświetlenie przedsionka gdy nie jest oświetlany światłem dziennym w czasie działania obiektu',
			'6.2.3.	Oświetlenie jest zainstalowane bezpiecznie dla użytkowników',
			'6.2.4.	Istotne przestrzenie są oświetlone w sposób równomierny',
			'6.2.5.	Czujnik obecności lub sterowanie poprzez system BMS',
			'6.2.6.	Jeśli stosuje się włączniki światła muszą one znajdować się na wysokości 80-120 cm.',
			'6.2.7.	Włącznik światłą kontrastuje z kolorem tłą ściany min. 30 stopni w skali lrv ',
			'6.2.8.	Oświetlenie jest min. 100 lx',
			'6.2.9.	Żródło światła nie znajduje się w odpowiednim miejscu',
			'6.2.10.	Światło naturalne wpadające do budynku jest regulowane za pomocą np.: żaluzji i innych urządzeń',
		],
	},
]

const elementsData7 = [
	{
		name: 'Korytarze',
		content: [
			{
				type: 'input',
				name: 'Lokalizacja',
				value: '', // Miejsce na wpisanie lokalizacji
			},
			{
				type: 'input',
				name: 'Szerokość korytarza',
				value: '', // Miejsce na wpisanie szerokości
			},
			{
				type: 'input',
				name: 'Szerokość <180 cm, co 25 m (wymijanie się wózków)',
				value: '', // Miejsce na wpisanie szerokości
			},
			{
				type: 'input',
				name: 'Równa nawierzchnia',
				value: '', // Miejsce na wpisanie szerokości
			},
			{
				type: 'input',
				name: 'Powierzchnia antypoślizgowa',
				value: '', // Miejsce na wpisanie szerokości
			},
			{
				type: 'input',
				name: 'Wysokość min. 220cm',
				value: '', // Miejsce na wpisanie szerokości
			},
			{
				type: 'input',
				name: 'Równomiernie oświetlone',
				value: '', // Miejsce na wpisanie szerokości
			},
			{
				type: 'input',
				name: 'Min. 100 lx',
				value: '', // Miejsce na wpisanie szerokości
			},
			{
				type: 'input',
				name: 'Spełnione',
				value: '', // Miejsce na wpisanie szerokości
			},	
		],
	},
]

/*
8.2.	Stopnie
8.2.1.	Maksymalne wysokość 17,5 cm
8.2.2.	Wysokość stopnia schodów zewnętrznych wynosi 15 cm, wewnętrznych 17,5 cm
8.2.3.	Na zewnątrz obiektów - bieg schodowy  zawiera maksymalnie 10 stopni 
8.2.4.	Wewnątrz obiektów wynosi 17 stopni 
8.2.5.	Stopnie schodów nie są ażurowe 
8.2.6.	Schody nie posiadają wystających nosków
8.2.7.	Stopnie schodów są wyprofilowane tak, aby zapobiegać zatykaniu się przy wchodzeniu oraz zahaczeniu o nie tyłem buta przy schodzeniu
8.2.8.	Nawierzchnia schodów jest antypoślizgowa
8.2.9.	Wszystkie stopnie w biegu mają  tą samą wysokość
8.2.10.	Szerokość stopni w schodach wewnętrznych wynosi 25-30 cm
8.3.	Balustrady
8.3.1.	"Schody zewnętrzne i wewnętrzne, służące do pokonania wysokości przekraczającej 50 cm,
Są z balustradą lub innym zabezpieczeniem od strony przestrzeni otwartej, o wysokości 110 cm"
8.3.2.	Schody zewnętrzne i wewnętrzne  mają balustrady lub poręcze przyścienne umożliwiające lewo- i prawostronne ich użytkowanie
8.3.3.	Przy szerokości biegu schodów większej niż 4 m należy zastosować dodatkową balustradę pośrednią
8.3.4.	Maksymalny prześwit lub wymiar otworu pomiędzy elementami wypełnienia balustrady nie jest większy niż 12 cm
8.3.5.	Zastosowano poręczę na wysokości 85 - 100 cm pierwszą   
8.3.6.	Dodatkowo na wysokości 60 - 75 cm drugą 
8.3.7.	Poręcze przy schodach przed ich początkiem i za końcem są przedłużone o min. 30 cm w poziomie oraz zakończyć w sposób zapewniający bezpieczne użytkowanie
8.3.8.	Poręcze przy schodach oddalone od ścian, do których są mocowane, co najmniej 5 cm
8.3.9.	Część chwytna poręczy ma średnicę w zakresie 3,5 cm - 4,5 cm
8.3.10.	Na końcach poręczy są zamontowane oznaczenia dotykowe (pismo wypukłe lub piktogramy dotykowe) i w alfabecie braille'a,
8.3.11.	Końce poręczy są zawinięte w dół lub zamontowane do ściany, tak aby nie można było zaczepić się fragmentami ubrania,
8.3.12.	Zapewniono ciągłość prowadzenia poręczy na schodach wielobiegowych
8.3.13.	Dopuszczono przerwanie ciągłości poręczy w przypadku spoczników o długości większej niż 3 m
8.3.14.	Poręcze są w kolorze kontrastującym z tłem ściany
8.3.15.	Linia poręczy jest wiernie odzwierciedlać bieg schodów
8.4.	oznaczenia
8.4.1.	W odległości 50 cm przed krawędzią pierwszego stopnia schodów w dół oraz przed krawędzią pierwszego stopnia schodów w górę, ułożono fakturę ostrzegawczą o szerokości nie mniejszej niż 40 cm i nie większej niż 60 cm
8.4.2.	Powierzchnie spoczników schodów powinny mieć wykończenie wyróżniające je odcieniem, barwą bądź fakturą, min. W pasie 30 cm od krawędzi rozpoczynającej i kończącej bieg schodów
8.4.3.	Wszystkie krawędzie stopni są oznaczone przy pomocy kontrastowego pasa o szerokości 5 cm umieszczonego wzdłuż całej krawędzi stopni w poprzek biegu 
8.4.4.	Zachowano  bezpieczną skrajnię ruchu pieszych i gdy bieg schodowy jest nadwieszony nad ciągiem pieszym, przestrzeń pod schodami o wysokości mniejszej niż 220 cm powinna być obudowana lub oznaczona 
8.5.	Oprawa oświetleniowa
8.5.1.	Czy są zainstalowane bezpiecznie dla użytkowników
8.5.2.	Czy oświetlenie jest min. 100 lx
*/

const elementsData8 = [
	{
		name: 'SZEROKOŚĆ BIEGÓW',
		content: [
			'8.1.1.Minimalna szerokość 120 cm',
			'8.1.2.Schody do piwnic pomieszczeń technicznych i poddaszy nieużytkowych - 80cm',
			'8.1.3.Szerokość użytkowa schodów zewnętrznych do budynku wynosi co najmniej 120 cm',
			'8.1.4.Szerokości schodów nie są ograniczane przez zainstalowane urządzenia oraz elementy budynku',
			'8.1.5.	Szerokość spoczników schodów stałych w budynku wynosi min. 150 cm',
		],
	},
	{
		name: 'STOPNIE',
		content: [
			'8.2.1.Maksymalne wysokość 17,5 cm',
			'8.2.2.Wysokość stopnia schodów zewnętrznych wynosi 15 cm, wewnętrznych 17,5 cm',
			'8.2.3.Na zewnątrz obiektów - bieg schodowy  zawiera maksymalnie 10 stopni ',
			'8.2.4.Wewnątrz obiektów wynosi 17 stopni ',
			'8.2.5.Stopnie schodów nie są ażurowe ',
			'8.2.6.Schody nie posiadają wystających nosków',
			'8.2.7.Stopnie schodów są wyprofilowane tak, aby zapobiegać zatykaniu się przy wchodzeniu oraz zahaczeniu o nie tyłem buta przy schodzeniu',
			'8.2.8.Nawierzchnia schodów jest antypoślizgowa',
			'8.2.9.Wszystkie stopnie w biegu mają  tą samą wysokość',
			'8.2.10.Szerokość stopni w schodach wewnętrznych wynosi 25-30 cm',
		],
	},
	{
		name: 'BALUSTRADY',
		content: [
			'8.3.1.Schody zewnętrzne i wewnętrzne, służące do pokonania wysokości przekraczającej 50 cm, są z balustradą lub innym zabezpieczeniem od strony przestrzeni otwartej, o wysokości 110 cm',
			'8.3.2.Schody zewnętrzne i wewnętrzne  mają balustrady lub poręcze przyścienne umożliwiające lewo- i prawostronne ich użytkowanie',
			'8.3.3.Przy szerokości biegu schodów większej niż 4 m należy zastosować dodatkową balustradę pośrednią',
			'8.3.4.Maksymalny prześwit lub wymiar otworu pomiędzy elementami wypełnienia balustrady nie jest większy niż 12 cm',
			'8.3.5.Zastosowano poręczę na wysokości 85 - 100 cm pierwszą',
			'8.3.6.Dodatkowo na wysokości 60 - 75 cm drugą',
			'8.3.7.Poręcze przy schodach przed ich początkiem i za końcem są przedłużone o min. 30 cm w poziomie oraz zakończyć w sposób zapewniający bezpieczne użytkowanie',
			'8.3.8.Poręcze przy schodach oddalone od ścian, do których są mocowane, co najmniej 5 cm',
			'8.3.9.Część chwytna poręczy ma średnicę w zakresie 3,5 cm - 4,5 cm',
			'8.3.10.Na końcach poręczy są zamontowane oznaczenia dotykowe (pismo wypukłe lub piktogramy dotykowe) i w alfabecie braillea',
			'8.3.11.Końce poręczy są zawinięte w dół lub zamontowane do ściany, tak aby nie można było zaczepić się fragmentami ubrania',
			'8.3.12.Zapewniono ciągłość prowadzenia poręczy na schodach wielobiegowych',
			'8.3.13.Dopuszczono przerwanie ciągłości poręczy w przypadku spoczników o długości większej niż 3 m',
			'8.3.14.Poręcze są w kolorze kontrastującym z tłem ściany',
			'8.3.15.Linia poręczy jest wiernie odzwierciedlać bieg schodów',
		],
	},
	{
		name: 'OZNACZENIA',
		content: [
			'8.4.1.W odległości 50 cm przed krawędzią pierwszego stopnia schodów w dół oraz przed krawędzią pierwszego stopnia schodów w górę, ułożono fakturę ostrzegawczą o szerokości nie mniejszej niż 40 cm i nie większej niż 60 cm',
			'8.4.2.Powierzchnie spoczników schodów powinny mieć wykończenie wyróżniające je odcieniem, barwą bądź fakturą, min. W pasie 30 cm od krawędzi rozpoczynającej i kończącej bieg schodów',
			'8.4.3.Wszystkie krawędzie stopni są oznaczone przy pomocy kontrastowego pasa o szerokości 5 cm umieszczonego wzdłuż całej krawędzi stopni w poprzek biegu ',
			'8.4.4.Zachowano  bezpieczną skrajnię ruchu pieszych i gdy bieg schodowy jest nadwieszony nad ciągiem pieszym, przestrzeń pod schodami o wysokości mniejszej niż 220 cm powinna być obudowana lub oznaczona',
		],
	},
	{
		name: 'OPRAWA OŚWIETLENIOWA',
		content: ['8.5.1.Czy są zainstalowane bezpiecznie dla użytkowników', '8.5.2.Czy oświetlenie jest min. 100 lx'],
	},
]

/*

    
*/

const elementsData9 = [
	{
		name: 'PRZESTRZEŃ MANEWROWA PRZED DŹWIGIEM OSOBOWYM',
		content: [
			'9.1.1.Wszystkie istone kondygnacje są dostępne dla osób niemogących się samodzielnie poruszać poprzez dzwigi osobowe i platformy',
			'9.1.2.Odległość drzwi dźwigu od ściany/przeszkody - min 1,6m',
			'9.1.3.Informacja o kondygnacji',
			'9.1.4.Numer czytelny przez dotyk',
			'9.1.5.Wypukłe cyfry min. 4 cm lub napisane alfabetem braillea po obu stronach ościeżnicy',
			'9.1.6.Obramowanie jest oznakowane w sposób kontrastowy w stosunku do otoczenia',
			'9.1.7.Na dojściu do dźwigu zastosowano system fakturowy prowadzący do panelu przywoławczego',
		],
	},
	{
		name: 'WYMIARY KABINY ORAZ JEJ WYPOSAŻENIE',
		content: [
			'9.2.1.Kabina ma szerokość co najmniej 110 cm',
			'9.2.2.Kabina ma długość co najmniej  140 cm',
			'9.2.3.Po obu stronach kabiny znajdują się ciągłe poręcze',
			'9.2.4.Poręcze -  ich górna część na wysokości 90 cm',
			'9.2.5.W poręczy jest przerwa jeżeli kabinowy panel sterujący znajduje się na tej samej ścianie ',
			'9.2.6.Różnica poziomów podłogi kabiny, zatrzymującego się na kondygnacji użytkowej,i posadzki tej kondygnacji przy wyjściu z dźwigu nie jest większa niż 2 cm (optymalnie do 1 cm)',
			'9.2.7.Drzwi do kabiny mają szerokość 90 cm (zalecana 100 cm)',
			'9.2.8.Drzwi dźwigu otwierają się i zamykać automatycznie',
			'9.2.9.System  oparty na czujnikach (np. Podczerwień) zatrzymujących zamykanie drzwi jeszcze przed kontaktem fizycznym z przedmiotem lub osobą',
			'9.2.10.Na ścianie przeciwnej do drzwi wejściowych jest  lustro  (jeśli kabina jest min. 150x150cm - nie jest konieczne)',
			'9.2.11.Lustro, na wysokości maksymalnie 40 cm od poziomu podłogi',
			'9.2.12.Kabina, jak i szyb są przeszklone',
			'9.2.13.Kabina dźwigu i panele kontrolne są dobrze oświetlone',
		],
	},
	{
		name: 'ZEWNETRZNY PANEL STERUJACY',
		content: [
			'9.3.1.Zewnętrzny panel sterujący na wysokości 80 - 120 cm od posadzki',
			'9.3.2.Przy każdych drzwiach do dźwigu należy umieścić sygnalizację świetlną i dźwiękową',
			'9.3.3.Pojedynczy sygnał dźwiękowy oznacza wjazd do góry, podwójny zjazd na dół',
			'9.3.4.Panele z wypukłymi klawiszami',
		],
	},
	{
		name: 'WEWNĘTRZNY PANEL STERUJĄCY',
		content: [
			'9.4.1.Panel sterujący w kabinie na wysokości 80 - 120 cm nad podłogą ',
			'9.4.2.Panel sterujący w kabinie w odległości 50 cm od naroża kabiny',
			'9.4.3.W przypadku drzwi otwieranych centralnie: po prawej stronie wejścia do kabiny',
			'9.4.4.W przypadku drzwi otwieranych jednostronnie: po stronie zgodnej z kierunkiem zamykania drzwi,',
			'9.4.5.Przyciski piętrowe nad przyciskami alarmu i drzwi',
			'9.4.6.Przyciski pojedyncze: w jednym rzędzie, pionowo lub poziomo',
			'9.4.7.W przypadku większej ilości przycisków rozmieszczenie mijankowe',
			"9.4.8.Wyposażony w dodatkowe oznakowanie dla osób niewidomych i niedowidzących (wypukłe opisy, cyfry lub symbole oraz oznaczenia w alfabecie braille'a) oraz informację głosową,",
			'9.4.9.Przycisk przystanku wyjściowego z budynku wystaje 5 mm (+/- 1 mm) ponad pozostałe przyciski (zalecany kolor zielony)',
		],
	},
	{
		name: 'PLATFORMY PIONOWE I UKOŚNE',
		content: [
			'9.5.1.Wysokość podnoszenia bez szybu i wewnątrz budynku do 3m',
			'9.5.2.Wysokość podnoszenia z szybem do 12m',
			'9.5.3.Podnośnik pionowy – min. 90x140 cm, przy udźwigu nie mniejszym niż 315 kg,',
			'9.5.4.Podnośnik schodowy – min. 75x100 cm, przy udźwigu nie mniejszym niż 250 kg',
			'9.5.5.Podłoga antypoślizgowa',
			'9.5.6.Platforma podnośnika wyposażona w barierki ',
			'9.5.7.Jeżeli przy wejściu zamontowano platformę umożliwia samodzielne korzystanie',
			'9.5.8.Możliwość wezwania pracownika obiektu',
		],
	},
]

const elementsData10 = [
	{
		name: 'POMIESZCZENIA HIGIENICZNO-SANITARNE',
		content: ['10a.1.Umiejscowienie w budynku - opisowo'],
	},
	{
		name: 'TOALETY',
		content: [
			'10b.1.Przestrzeń manewrowa',
			'10b.1.1.Obszar manewrowy o minimalnych wymiarach 150x150 cm',
			'10b.1.2.Nie zachodzą elementy wyposażenia',
			'10b.1.3.Wszystkie odpływy wody z poziomu posadzki powinny znajdować się poza przestrzenią manewrową wózka',
		],
	},
	{
		name: 'URZĄDZENIA ALARMOWE',
		content: [
			'10b.2.1.Przycisk/ linka do wzywania pomocy na wysokości 40 cm od poziomu posadzki',
			'10b.2.2.Uruchamianie urządzeń alarmowych w toalecie nie wymaga siły przekraczającej 30 n',
		],
	},
	{
		name: 'POWIERZCHNIE ŚCIAN I PODŁÓG',
		content: [
			'10b.3.1.Ściany i podłogi są ze sobą skontrastowane;',
			'10b.3.2.Powierzchnie ścian oraz powierzchnie podłóg o kontraście kolorystycznym mniejszym od lrv=20',
			'10b.3.3.Podłogi i posadzki w toaletach powinny być wykonywane z materiałów antypoślizgowych',
		],
	},
	{
		name: 'DRZWI',
		content: [
			"10b.4.1.Wejście do toalety powinno być oznaczone za pomocą piktogramów na ścianach oraz informacją w alfabecie braille'a",
			'10b.4.2.Drzwi otwierane na zewnątrz, o szerokości co najmniej 90 cm',
			'10b.4.3.Zaleca się montowanie drzwi bez siłowników',
			'10b.4.4.Ręczne otwieranie i zamykanie drzwi toalety nie powinno wymagać siły przekraczającej 60 n',
		],
	},
	{
		name: 'POZOSTAŁE ELEMENTY',
		content: [
			'10b.5.1.Włączniki światła powinny się znajdować na wysokości 80 - 110 cm od poziomu posadzki',
			'10b.5.2.Oświetlenie umożliwia korzystanie z pomieszczenia - min. 100 lx',
			'10b.5.3.Wieszaki na ubrania na wysokości ok. 180 cm i przynajmniej jeden na wysokości ok. 110 cm',
		],
	},
	{
		name: 'MISKA USTĘPOWA',
		content: [
			'10c.1.Przestrzeń manewrowa obok muszli',
			'10c.1.1.Szerokości min. 90 cm (zalecana z obydwu stron),',
			'10c.1.2.Górna krawędź deski znajduje się na wysokości 42-48 cm',
			'10c.1.3.Oś muszli nie bliżej niż 45 cm od ściany',
			'10c.1.4.Deska klozetowa powinna być jednolita, bez wycięć, stabilna',
		],
	},
	{
		name: 'PORĘCZE',
		content: [
			'10c.2.1.W odległości 30 - 40 cm od osi muszli ',
			'10c.2.2.Na wysokości 70-85 cm (górna krawędź poręczy)',
			'10c.2.3.Wystające 10 - 15 cm przed muszlę',
		],
	},
	{
		name: 'SPŁUCZKA',
		content: [
			'10c.3.1.Przycisk spłuczki powinien się znajdować z boku miski ustępowej na wysokości nieprzekraczającej 80 - 110 cm ',
			'10c.3.2.Podajnik papieru toaletowego powinien się znajdować na wysokości 60 - 70 cm od posadzki',
		],
	},
	{
		name: 'UMYWALKA',
		content: [
			'10d.1.Wysokość',
			'10d.1.1.Górna krawędź na wysokości 75 - 85 cm od posadzki',
			'10d.1.2.Dolna krawędź nie niżej niż 60 - 70 cm od posadzki',
			'10d.1.3.Lustro: dolna krawędź nie wyżej niż 80 cm od poziomu posadzki lub bezpośrednio nad umywalką',
			'10d.1.4.Dozownik mydła, suszarka/ręczniki: na wysokości 80 - 110 cm od poziomu posadzki',
		],
	},
	{
		name: 'PRZESTRZEŃ MANEWROWA',
		content: [
			'10d.2.1.Przed umywalką o wymiarach 90x150cm',
			'10d.2.2.Nie więcej niż 40 cm tej przestrzeni może znajdować się pod umywalką',
		],
	},
	{
		name: 'PORĘCZE',
		content: [
			'10d.3.1.Montowane po obu stronach umywalki na wysokości 90 - 100 cm',
			'10d.3.2.Odległość  nie mniejszej niż 5 cm pomiędzy krawędzią poręczy a umywalką',
		],
	},
	{
		name: 'WANNA',
		content: [
			'10e.1.Wysokość',
			'10e.1.1.Wanny powinny być możliwie duże (umożliwiające hydroterapię), o minimalnych wymiarach 170x70 cm',
			'10e.1.2.Wysokość górnej krawędzi nie powinna przekraczać 50 cm',
			'10e.2.Przestrzeń manewrowa',
			'10e.2.1.Wynosić 140 cm x (długość wanny)',
			'10e.2.2.Wanna powinna być przedłużona podestem lub wyposażona w ruchomą ławeczkę',
		],
	},
	{
		name: 'PORĘCZE',
		content: [
			'10e.3.1.Na wysokości 70 - 90 cm od poziomu podłogi',
			'10e.3.2.Długość poręczy powinna wynosić min. 60 cm',
		],
	},
	{
		name: 'PRYSZNIC',
		content: [
			'10f.1.Natrysk ',
			'10f.1.1.Bezprogowa powierzchnia o wymiarach 150x150 cm',
			'10f.1.2.Siedzisko prysznicowe z oparciem, mocowane do ściany, na wysokości 42 - 50 cm od podłogi',
			'10f.1.3.Poręcze powinny być montowane na wysokości 90 - 100 cm nad poziomem podłogi',
			'10f.1.4.Baterie z termostatem powinny znajdować się na wysokości 80 - 90 cm nad poziomem podłogi',
			'10f.2.Kabina  niezamknięta',
			'10f.2.1.Minimalna szerokość 90 cm',
			'10f.2.2.Minimalna powierzchnia kabiny 0,9 m2',
			'10f.2.3.Minimalna powierzchnia manewrowa przed kabiną 90x120 cm2',
			'10f.3.Kabina  zamknięta',
			'10f.3.1.Minimalna szerokość 150 cm',
			'10f.3.2.Minimalna powierzchnia kabiny 2,5 m2',
		],
	},
	{
		name: 'SŁUCHAWKA PRYSZNICOWA',
		content: ['10f.4.1.Długość co najmniej 150 cm', '10f.4.2.Wysokość 90 - 210 cm nad poziomem podłóg'],
	},
]

const elementsData11 = [
	{
		name: 'POKOJE RODZICA Z DZIECKIEM',
		content: [
			'11.1.1.Zapewniono (wymagany w budynkach użyteczności publicznej o powierzchni powyżej 1000m²)',
			'11.1.2.Pomieszczenie dostosowane do przewijania i karmienia, odpowiednio wyposażone',
			'11.1.3.Przewijak na wysokości 0,8 do 0,85 m, pod nim pusta przestrzeń, o wymiarach nie mniejszych niż 50 na 70 cm, bez ostrych krawędzi,  z zabezpieczeniem zapobiegającym zsuwaniu się dziecka',
		],
	},
]

const elementsData12 = []

const elementsData13 = []

const elementsData14 = [
	{
		name: 'OZNAKOWANIE PIĘTER',
		content: ['14.1.1.Wysokość 1,2-1,4 m', '14.1.2.Na piętrze umieszczony w widocznym, łatwym do odnalezienia miejscu'],
	},
	{
		name: 'PLAN EWAKUACJI',
		content: ['14.2.1.Wysokość 1,2-1,4 m', '14.2.2.Na piętrze umieszczony w widocznym, łatwym do odnalezienia miejscu'],
	},
	{
		name: 'MIEJSCA OCZEKIWANIA OSÓB Z NIEPEŁNOSPRAWNOŚCIĄ NA EWAKUACJĘ Z OBIEKTU',
		content: [
			'14.3.1.Zlokalizowane na klatkach schodowych',
			'14.3.2.Miejsce oczekiwania nie może ograniczać szerokości drogi ewakuacji',
			'14.3.3.Wyposażone w środki gaśnicze, koce ochronne i specjalne siedzisko do ewakuacji osób o ograniczonych możliwościach ruchowych',
			'14.3.4.Wyposażone w urządzenia komunikacji, pozwalające na dwukierunkową łączność ze służbami odpowiedzialnymi za ewakuacji',
			'14.3.5.Przeszkolenie osób odpowiedzialnych za ewakuację z zasad dotyczących ewakuacji osób z ograniczoną możliwością poruszania się',
		],
	},
	{
		name: 'OCHRONA PRZECIWPOŻAROWA',
		content: [
			'14.4.1.Systemy sygnalizacji pożarowej sygnalizatorów świetlnych i akustycznych',
			'14.4.2.Drzwi ewakuacyjne oznaczone na kolor żółty, czyli o największym kontraście względem otoczenia',
			'14.4.3.Dodatkowa oprawa oświetleniowa nad wyjściami ewakuacyjnymi',
			'14.4.4.Znaki bezpieczeństwa dotyczące ewakuacji oświetlone wewnętrznie',
			'14.4.5.Wyposażenie holu windowego w intercom pożarowy z przekierowaniem do pomieszczenia ochrony',
		],
	},
	{
		name: 'DROGI EWAKUACYJNE',
		content: [
			'14.5.1.Brak stopni i progów na drogach ewakuacyjnych',
			'14.5.2.Zastosowano czytelną informację o drogach ewakuacji w formie  strzałek, piktogramów',
		],
	},
]

const elementsData15 = [
	{
		name: 'INFORMACJE WIZUALNE',
		content: [
			'15.1.1.Informacja w obiekcie jest adekwatna do jego funkcji. Na przykład, w budynkach użyteczności publicznej, takich jak urzędy, niezbędne jest oznaczenie najważniejszych miejsc, takich jak biura obsługi interesantów, toalety, klatki schodowe, windy, piętra, pokoje obsługi i sale spotkań. W przypadku skomplikowanego układu komunikacji w budynku, wymagane jest również wskazanie kierunku drogi do tych miejsc.',
			'15.1.2.System informacyjny w obrębie całego obiektu jest spójny. Nie należy stosować kilku systemów informacyjnych w różnych częściach obiektu.',
			'15.1.3.Znaki kontrastują z tłem na poziomie min. 60 stopni lrv',
			'15.1.4.Wielkość znaków (symboli lub liter) musi być adekwatna do ich położenia oraz odległości z jakiej są czytane.',
			'15.1.5."Informacja wizualna odczytywana z większych odległości (np. Tablice Kierunkowe) na wysokości min. 2,2 m od poziomu posadzki"',
			'15.1.6."Informacje odczytywane z bliska (np. Informacje o funkcji pomieszczeń) na Wysokości 1,2 do 1,6 m."',
			'15.1.7.Stosowane są kroje liter bezszeryfowych.',
			'15.1.8.Pisanie tekstów wielkimi i małymi literami, a nie wyłącznie wielkimi lub wyłącznie małymi literami , np. Toaleta, a nie toaleta.',
			'15.1.9.Informacje są oświetlona światłem o natężeniu o min. 15 lx większym niż światło otoczenia.',
			'15.1.10.Ekrany są wykonane z takich materiałów i umieszczone w taki sposób, żeby oświetlenie naturalne lub sztuczne nie utrudniało odczytania wyświetlanych na nich treści.',
			'15.1.11."Wielkość znaków (symboli lub liter) jest adekwatna do ich położenia oraz odległości z jakiej są czytane."',
		],
	},
	{
		name: 'INFORMACJE DOTYKOWE',
		content: [
			'15.2.1.Informację przy wejściach do pomieszczeń należy umieszczać w sposób konsekwentny w całym obiekcie. Dopuszcza się następujący sposoby lokalizowania informacji na skrzydle drzwi ponad klamką lub na ścianie obok drzwi po stronie klamki na wysokości 120 - 160 cm',
			'15.2.2.Informację są w alfabecie braillea o parametrach zgodnych z marburg medium lub podobnym standardem. Informacja ta powinna dotyczyć funkcji pomieszczeń, numerów pokojów, nazw działów lub osób pracujących w tych pomieszczeniach.',
			'15.2.3.Stosowane są informacje w postaci wypukłych piktogramów (np. Toalety), liter i numerów pomieszczeń (np. Biura). Znaki powinny mieć wysokość od 15 do 55 mm oraz wypukłość od 0,8 do 1,5 mm.',
		],
	},
]

const elementsData16 = [
	{
		name: 'MATERIAŁY WYKOŃCZENIOWE',
		content: [
			'16.1.1.W hałaśliwych przestrzeniach, gdzie dźwięki są zniekształcone i trudno zrozumieć przekazywaną mowę, stosuje się materiały wykończeniowe zaprojektowane do pochłaniania dźwięków. Przykłady takich materiałów to dywany, sufity akustyczne, panele akustyczne, perforowane przegrody, zasłony materiałowe oraz tapicerowane meble.',
			'16.1.2.Jeśli na drzwiach i przegrodach ponad 75% powierzchni stanowią materiały przezroczyste, wymagane są widoczne oznaczenia. W przypadku przegród przezroczystych zamiast stosowania oznaczeń, można ograniczyć dostęp do nich poprzez odpowiednie zagospodarowanie przestrzeni.',
		],
	},
]

export {
	elementsData1,
	elementsData2,
	elementsData3,
	elementsData4,
	elementsData5,
	elementsData6,
	elementsData7,
	elementsData8,
	elementsData9,
	elementsData10,
	elementsData11,
	elementsData12,
	elementsData13,
	elementsData14,
	elementsData15,
	elementsData16,
}
