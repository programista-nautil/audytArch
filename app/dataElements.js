const elementsData1 = [
	{
		name: '1',
		content: ['Lokalizacja'],
	},
	{
		name: 'CIĄGI KOMUNIKACYJNE',
		content: [
			'1.1.1.	Brak nierównego chodnika, wysokich krawężników i przeszkód',
			'1.1.2.	Kontrastowe i antypoślizgowe materiały wykończeniowe ułatwiające orientację i poruszanie się',
			'1.1.3.	Podkreślenie głównych ciągów komunikacyjnych za pomocą faktury materiału, zastosowanie ścieżek dotykowych.',
			'1.1.4.	Wyposażenie, miejsca odpoczynku, siedzenia i elementy małej architektury znajdują się poza szerokością 1,8 m (główna trasa dojścia do budynku).',
			'1.1.5.	Minimalna szerokość ciągi komunikacyjne: 150 cm (oddzielone od jezdni), 200 cm (przy jezdni).',
			'1.1.6.	W ciągach pieszych o szerokości poniżej 180 cm i długości powyżej 50 m miejsca mijania o długości 200 cm i szerokości 180 cm co 25 m.',
			'1.1.7.	Ścieżki rowerowe wyraźnie oddzielone od chodnika.',
		],
	},
	{
		name: 'PRZEJŚCIE DLA PIESZYCH',
		content: [
			'1.2.1.	Zastosowanie następujących rozwiązań: rampy krawężnikowe, przejście na progu zwalniającym lub umieszczenie jezdni i chodnika na jednym poziomie (można stosować tylko w miejscu gdzie ruch samochodowy jest rzadki, a piesi mają bezwzględne pierwszeństwo).',
			'1.2.2.	Szerokość rampy 90 cm, nachylenie maks. 5%, w wyjątkowych sytuacjach 15%, nachylenie boczne maks. 10%, wykończenie krawędzi rampy w zależności od wysokości.',
			'1.2.3.	Pomiędzy chodnikiem a poziomem przejścia nie ma różnic wysokości, na granicy progu zwalniającego i chodnika nie występuje dodatkowe nachylenie, szerokość przejścia nie może być mniejsza niż 200 cm.',
			'1.2.4.	Nachylenie, w przypadku niewystarczającego nachylenia, w przypadku zastosowania ramp krawężnikowych i przy progach zwalniających zastosowano oznaczenie w formie zestawu wypukłych punktów (standard oznaczeń zależny od lokalizacji).',
			'1.2.5.	Zastosowano oznaczenie w postaci wypukłych punktów, pas o szerokości 80-100 cm przy krawędzi jezdni lub pas o szerokości 50-60 cm oddalony 0,5 m od krawędzi jezdni na całej szerokości przejścia dla pieszych.',
		],
	},
	{
		name: 'WYPOSAŻENIE ZEWNĘTRZNE',
		content: [
			'1.3.1.	Ławki wyposażone w oparcia i podłokietniki (przynajmniej 1/3 miejsc siedzących).',
			'1.3.2.	Zapewniono miejsca postojowe dla rowerów.',
		],
	},
	{
		name: 'OŚWIETLNIE ZEWNĘTRZNE',
		content: [
			'1.4.1.	Równomierna dystrybucja światła i odpowiednie natężenie światła na całej trasie dojścia do budynku.',
		],
	},
]

const elementsData2 = [
	{
		name: '2',
		content: ['Lokalizacja'],
	},
	{
		name: 'LOKALIZACJA STANOWISK POSTOJOWYCH',
		content: [
			'2.1.1.Ilość miejsc postojowych dla OZN przy ogólnej liczbie miejsc postojowych: 1 przy 615, 2 przy 1640, 3 przy 41100, 4% przy ponad 100',
			'2.1.2.Miejsca parkingowe dla osób z niepełnosprawnością powinny znajdować się blisko wejścia do budynku, jeżeli parking jest oddalony od budynku, miejsca w pobliżu wyjścia z parkingu',
			'2.1.3.W celu wspomagania osób z niepełnosprawnością wzroku wymaga się, aby systemy prowadzenia wyróżniały się kolorystycznie z tła',
			'2.1.4.Zapewnienie dostępu do chodnika bez stopni i przeszkód',
		],
	},
	{
		name: 'STANOWISKA POSTOJOWE',
		content: [
			'2.2.1.	Równa i gładka o prawidłowym spadku podłużnym i poprzecznym',
			'2.2.2.	Odpowiednie oznaczenie  poziome (niebieskie tło, opcjonalnie znak poziomy p 20 "koperta" i/lub znak poziomy p 24 "miejsce dla pojazdu osoby niepełnosprawnej"',
			'2.2.3.	Odpowiednie oznaczenie pionowe (znak pionowy d18a "parking  miejsce zastrzeżone" wraz z tabliczką t 29 informująca o miejscu dla osoby niepełnosprawnej',
			'2.2.4.	Wskaźnik odbicia światła słonecznego w wartości co najmniej 0,33',
			'2.2.5.	Wykonana z odpowiedniego materiału',
		],
	},
]

const elementsData3 = [
	{
		name: '3',
		content: ['Lokalizacja'],
	},
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
			'3.2.1.Szerokość min. 90 cm, w przypadku dwuskrzydłowych główne skrzydło o szerokości min. 90 cm',
			'3.2.2.Próg max 2 cm, ze ściętym klinem, w wyróżniającym się kolorze',
			'3.2.3.Są automatyczne',
			'3.2.4.Są lekkie i łatwe w obsłudze',
			'3.2.5.Klamka, zamek oraz dzwonek łatwe w identyfikacji oraz umieszczone na wysokości 80  120 cm nad poziomem podłogi',
			'3.2.6.Ściana od strony otwierania drzwi oddalona jest o min 60 cm',
			'3.2.7.W przypadku drzwi obrotowych lub wahadłowych towarzyszą im drzwi rozwierane lub przesuwne',
			'3.2.8.Prześwit wolny od przeszkód o szerokości 90 cm',
			'3.2.9.Przestrzeń manewrowa w wiatrołapie: minimum 150x150 cm, poza polem otwierania skrzydła drzwi',
		],
	},
	{
		name: 'DASZEK/PODCIEŃ OCHRONNY LUB POMIESZCZENIE PRZEDSIONKA',
		content: [
			'3.3.1. Prawidłowa szerokość i głębokość daszka: Szerokość min. 100 cm większa niż drzwi Głębokość lub wysięg: min. 100 cm (budynki do 12 m), 150 cm (budynki od 12 m)',
			'3.3.2.Umieszczony na wysokości min. 230 cm',
		],
	},
]

const elementsData4 = [
	{
		name: '4',
		content: ['Lokalizacja'],
	},
	{
		name: 'SCHODY ZEWNĘTRZNE',
		content: [
			'4.1.1.Ilość stopni w jednym biegu poniżej 10.',
			'4.1.2.Szerokość: biegu 1,2 m, szerokość spocznika 1,5 m.',
			'4.1.3.Głębokość stopni min. 35 cm, wysokość stopni max. 17,5 cm.',
		],
	},
	{
		name: 'BALUSTRADY I PORĘCZ',
		content: [
			'4.2.1.Schody zewnętrzne i wewnętrzne, służące do pokonania wysokości przekraczającej 50 cm, są z balustradą lub innym zabezpieczeniem od strony przestrzeni otwartej, o wysokości 110 cm.',
			'4.2.2.Przy szerokości biegu schodów większej niż 4 m należy zastosować dodatkową balustradę pośrednią.',
			'4.2.3.Maksymalny prześwit lub wymiar otworu pomiędzy elementami wypełnienia balustrady nie jest większy niż 12 cm.',
			'4.2.4.Zastosowano poręczę na wysokości 85-100 cm pierwszą.',
			'4.2.5.Dodatkowo na wysokości 60-75 cm drugą, szczególnie zalecane gdy w budynku znajdują się dzieci.',
			'4.2.6.Poręcze przy schodach przed ich początkiem i za końcem są przedłużone o min. 30 cm w poziomie użytkowania.',
			'4.2.7.Poręcze przy schodach oddalone od ścian, do których są mocowane, co najmniej 5 cm.',
			'4.2.8.Część chwytna poręczy ma średnicę w zakresie 3,5 cm - 4,5 cm.',
			"4.2.9.Na końcach poręczy są zamontowane oznaczenia dotykowe (pismo wypukłe lub piktogramy dotykowe) i w alfabecie braille'a.",
			'4.2.10.Końce poręczy są zawinięte w dół lub zamontowane do ściany, tak aby nie można było zaczepić się fragmentami ubrania.',
			'4.2.11.Zapewniono ciągłość prowadzenia poręczy na schodach wielobiegowych.',
			'4.2.12.Linia poręczy jest wiernie odzwierciedlać bieg schodów.',
		],
	},
	{
		name: 'OZNACZENIA',
		content: [
			'4.3.1.W odległości maks. 50 cm przed krawędzią pierwszego stopnia schodów w dół oraz przed krawędzią pierwszego stopnia schodów w górę, ułożono fakturę ostrzegawczą o szerokości nie mniejszej niż 40 cm i nie większej niż 60 cm.',
			'4.3.2.Powierzchnie spoczników schodów powinny mieć wykończenie wyróżniające je odcieniem, barwą bądź fakturą, min. w pasie 30 cm od krawędzi rozpoczynającej i kończącej bieg schodów.',
			'4.3.3.Wszystkie krawędzie stopni są oznaczone przy pomocy kontrastowego pasa o szerokości 5 cm umieszczonego wzdłuż całej krawędzi stopni w poprzek biegu.',
		],
	},
	{
		name: 'SKRAJNIA RUCHU POD SCHODAMI',
		content: [
			'4.4.1.Zachowano bezpieczną skrajnię ruchu pieszych i gdy bieg schodowy jest nadwieszony nad ciągiem pieszym, przestrzeń pod schodami o wysokości mniejszej niż 220 cm powinna być obudowana lub oznaczona.',
		],
	},
]

const elementsData5 = [
	{
		name: '5',
		content: ['Lokalizacja'],
	},
	{
		name: 'Szerokość , długość i  spoczniki',
		content: [
			'5.1.1.Pochylnie powinny mieć szerokość płaszczyzny ruchu minimum 120 cm',
			'5.1.2.Pochylnie o długości ponad 9 m powinny być podzielone na krótsze odcinki,',
			'5.1.3.Przy zastosowaniu spoczników o długości co najmniej 140 cm (zalecane 200 cm)',
			'5.1.4.Szerokość spocznika nie może być mniejsza niż szerokość biegu pochylni',
			'5.1.5.Jeżeli na spoczniku następuje zmiana kierunku należy zapewnić na nim powierzchnię Manewrową o minimalnych wymiarach 150x150 cm (zalecane 200x200 cm),',
			'5.1.6.W dużych obiektach użyteczności publicznej  zaleca się stosowanie większych spoczników o wymiarach 210x210 cm, tak aby zapewnić odpowiednią powierzchnię manewrową dla jak najszerszej grupy użytkowników np. korzystających ze skuterów elektrycznych',
			'5.1.7.Długość poziomej płaszczyzny na początku i na końcu pochylni powinna wynosić co najmniej 150 cm, poza polem otwierania drzwi',
			'5.1.8.Pochylnia powinna zawierać krawężniki o wysokości od 7 cm do 10 cm, w celu uniknięcia niekontrolowanego zjazdu wózka.',
			'5.1.9.Nawierzchnia pochylni powinna zapewnić możliwość swobodnego poruszania się, tzn. powinna być twarda, równa i mieć powierzchnię antypoślizgową',
		],
	},
	{
		name: 'Nachylenie',
		content: [
			'5.2.1.Odpowiednie nachylenie pochylni.',
			'5.2.2.Różnica wysokości powyżej 50cm   max nachylenie 8% (wewnętrzne lub pod daszkiem)',
			'5.2.3.Różnica wysokości do 15 cm   max nachylenie 15% (na zewnątrz)',
			'5.2.4.Różnica wysokości do 50cm   max nachylenie 8% (na zewnątrz)',
			'5.2.5.Różnica wysokości powyżej 50cm   max nachylenie 6% (na zewnątrz)',
		],
	},
	{
		name: 'Poręcze',
		content: [
			'5.3.1.Po obu stronach pochylni należy zainstalować poręcze na wysokości 75 i 90 cm',
			'5.3.2.Odstęp między poręczami musi mieścić się w granicach od 100 cm do 110 cm',
			'5.3.3.Poręcze przy pochylniach należy przedłużyć o 30 cm na ich początku, końcu oraz zakończyć w sposób zapewniający bezpieczne użytkowanie',
			'5.3.4.Poręcze przy pochylniach powinny być równoległe do nawierzchni',
			'5.3.5.Część chwytna poręczy powinna mieć średnicę 3,5  4,5 cm',
			'5.3.6.Część chwytna poręczy powinna być oddalona od ściany o co najmniej 5 cm',
		],
	},
	{
		name: 'Oznaczenia',
		content: [
			'5.4.1.Na końcach poręczy oznaczenie dotykowe w alfabecie braillea i/lub pismo wypukłe',
			'5.4.2.Powierzchnie spoczników pochylni powinny mieć wykończenie wyróżniające je odcieniem, barwą bądź fakturą, co najmniej w pasie 30 cm od krawędzi rozpoczynającej i kończącej bieg pochylni',
		],
	},
]

const elementsData6 = [
	{
		name: '6',
		content: ['Lokalizacja'],
	},
	{
		name: 'Domofon',
		content: [
			'6.1. System audio-wizualny',
			'6.2. Umieszczony w widocznym miejscu, po stronie klamki od drzwi, blisko wejścia',
			'6.3. W kontrastujących kolorach względem tła, na którym się znajduje',
			'6.4. Ekran domofonu  znajduje się nie wyżej niż 120 cm nad poziomem podłogi',
			'6.5. Przyciski na wysokości 80 - 110 cm i w odległości minimum 60 cm od narożnika wewnętrznego',
			'6.6. Przyciski dzwonków do drzwi o odpowiednio dużej wielkości i dają wizualny i dźwiękowy sygnał',
			'6.7. Posiada świetlne i dźwiękowe potwierdzenie otwierania zamka',
			'6.8. Posiada sygnalizację świetlną informującą  kiedy mogą zacząć mówić',
			'6.9. Przyciski w kontrastujących kolorach względem panelu na którym się znajdują',
			'6.10. Każdy przycisk posiada wyraźny numer lub literę w kolejności alfabetycznej, możliwy przez dotyk',
			'6.11. Klawisze zamiast systemu dotykowego (sensorycznego), z wyraźnym oznakowaniem klawiszy cyframi wypukłymi lub zastosowaniem międzynarodowej klawiatury z wyróżnieniem dotykowym cyfry „5”',
			'6.12. Kamerka domofonu  uchwyca  twarz osoby',
			'6.13. Instrukcja obsługi  łatwa do odnalezienia i odczytania – na wysokości max 120 cm ',
		],
	},
]

const elementsData7 = [
	{
		name: '7',
		content: ['Lokalizacja'],
	},
	{
		name: 'Położenie i wyposażenie',
		content: [
			'7.1.1	Recepcję / punkt informacyjny przewidziano w pobliżu wejścia',
			'7.1.2.	Osoba obsługująca jest widoczna spoza lady',
			'7.1.3.	Dla przynajmniej jednego stanowiska recepcji / punktu informacyjnego przewidziano blat recepcji o szerokości min. 0,9 m, o wysokości 0,8 m',
			'7.1.4.	Dla przynajmniej jednego stanowiska recepcji / punktu informacyjnego przewidziano wolną przestrzeń na kolana osoby na wózku o minimalnych wymiarach 0,7 m wysokości x 0,6 m głębokości',
			'7.1.5.	Zapewniono przestrzeń manewrową dla osoby na wózku o minimalnych wymiarach 1,5x1,5 m przed stanowiskiem',
			'7.1.6.	Dla przynajmniej jednego stanowiska przewidziano wyposażenie w pętlę indukcyjną, a to stanowisko jest oznakowane symbolem',
			'7.1.7.	W przypadku oddzielenia osób przy blacie recepcji szybą musi ona być demontowalna lub recepcja wyposażona w system głośnomówiący (interkom)',
			'7.1.8.	Dojście do recepcji / punktu informacyjnego jest oznakowane zmienną fakturą lub systemem prowadzenia w posadzce',
			'7.1.9.	Przejście do stanowisk o danej funkcji pozbawione jest przeszkód',
			'7.1.10.	Tłumacz języka migowego online przy przynajmniej jednym stanowisku',
		],
	},
	{
		name: 'Oprawa oświetleniowa',
		content: [
			'7.2.1.	Główne wejście jest oświetlone',
			'7.2.2.	Oświetlenie przedsionka gdy nie jest oświetlany światłem dziennym w czasie działania obiektu',
			'7.2.3.	Zainstalowane oświetlenie jest bezpiecznie dla użytkowników',
			'7.2.4.	Istotne przestrzenie są oświetlone w sposób równomierny',
			'7.2.5.	Czujnik obecności lub sterowanie poprzez system BMS',
			'7.2.6.	Włączniki światła na wysokości 80-120 cm.',
			'7.2.7.	Włącznik światłą kontrastuje z kolorem tłą ściany min. 30 stopni w skali lrv ',
			'7.2.8.	Oświetlenie jest min. 100 lx',
			'7.2.9.	Żródło światła znajduje się w odpowiednim miejscu',
			'7.2.10. Światło naturalne wpadające do budynku jest regulowane za pomocą np.: żaluzji i innych urządzeń',
		],
	},
]

const elementsData8 = [
	{
		name: '8',
		content: ['Lokalizacja'],
	},
	{
		name: 'Korytarze',
		content: [
			'1. Lokalizacja',
			'2. Szerokość korytarza',
			'3. Szerokość <180 cm, co 25 m (wymijanie się wózków)',
			'4. Równa nawierzchnia',
			'5. Powierzchnia antypoślizgowa',
			'6. Wysokość min. 220cm',
			'7. Równomiernie oświetlone',
			'8. Min. 100 lx',
			'9. Spełnione',
		],
	},
]

const elementsData9 = [
	{
		name: '9',
		content: ['Lokalizacja'],
	},
	{
		name: 'SZEROKOŚĆ BIEGÓW',
		content: [
			'9.1.1.	Minimalna szerokość 120 cm',
			'9.1.2.	Schody do piwnic pomieszczeń technicznych i poddaszy nieużytkowych  80cm',
			'9.1.3.	Szerokości schodów nie są ograniczane przez zainstalowane urządzenia oraz elementy budynku',
			'9.1.4.	Szerokość spoczników schodów stałych w budynku wynosi min. 150 cm',
		],
	},
	{
		name: 'STOPNIE',
		content: [
			'9.2.1.Maksymalne wysokość 17,5 cm',
			'9.2.2.Wewnątrz obiektów wynosi 17 stopni',
			'9.2.3.Stopnie schodów nie są ażurowe',
			'9.2.4.Schody nie posiadają wystających nosków',
			'9.2.5.Stopnie schodów są wyprofilowane tak, aby zapobiegać zatykaniu się przy wchodzeniu oraz zahaczeniu o nie tyłem buta przy schodzeniu',
			'9.2.6.Nawierzchnia schodów jest antypoślizgowa',
			'9.2.7.Wszystkie stopnie w biegu mają  tą samą wysokość',
			'9.2.8.Szerokość stopni w schodach wewnętrznych wynosi 2530 cm',
		],
	},
	{
		name: 'PORĘCZE',
		content: [
			'9.3.1.Schody zewnętrzne i wewnętrzne, służące do pokonania wysokości przekraczającej 50 cm,są z balustradą lub innym zabezpieczeniem od strony przestrzeni otwartej, o wysokości 110 cm',
			'9.3.2.Schody zewnętrzne i wewnętrzne  mają balustrady lub poręcze przyścienne umożliwiające lewo- i prawostronne ich użytkowanie',
			'9.3.3.Przy szerokości biegu schodów większej niż 4 m należy zastosować dodatkową balustradę pośrednią',
			'9.3.4.Maksymalny prześwit lub wymiar otworu pomiędzy elementami wypełnienia balustrady nie jest większy niż 12 cm',
			'9.3.5.Zastosowano poręcz na wysokości 110 cm pierwszą',
			'9.3.6.Dodatkowo na wysokości 60 75 cm drugą',
			'9.3.7.Poręcze przy schodach oddalone od ścian, do których są mocowane, co najmniej 5 cm',
			'9.3.8.Część chwytna poręczy ma średnicę w zakresie 3,5 cm  4,5 cm',
			'9.3.9.Na końcach poręczy są zamontowane oznaczenia dotykowe (pismo wypukłe lub piktogramy dotykowe) i w alfabecie braillea,',
			'9.3.10.Końce poręczy są zawinięte w dół lub zamontowane do ściany, tak aby nie można było zaczepić się fragmentami ubrania,',
			'9.3.11.Zapewniono ciągłość prowadzenia poręczy na schodach wielobiegowych',
			'9.3.12.Dopuszczono przerwanie ciągłości poręczy w przypadku spoczników o długości większej niż 3 m',
			'9.3.13.Poręcze są w kolorze kontrastującym z tłem ściany',
			'9.3.14.Linia poręczy jest wiernie odzwierciedlać bieg schodów',
		],
	},
	{
		name: 'OZNACZENIA',
		content: [
			'9.4.1.W odległości 50 cm przed krawędzią pierwszego stopnia schodów w dół oraz przed krawędzią pierwszego stopnia schodów w górę, ułożono fakturę ostrzegawczą o szerokości nie mniejszej niż 40 cm i nie większej niż 60 cm',
			'9.4.2.Powierzchnie spoczników schodów powinny mieć wykończenie wyróżniające je odcieniem, barwą bądź fakturą, min. W pasie 30 cm od krawędzi rozpoczynającej i kończącej bieg schodów',
			'9.4.3.Wszystkie krawędzie stopni są oznaczone przy pomocy kontrastowego pasa o szerokości 5 cm umieszczonego wzdłuż całej krawędzi stopni w poprzek biegu',
			'9.4.4.Zachowano  bezpieczną skrajnię ruchu pieszych i gdy bieg schodowy jest nadwieszony nad ciągiem pieszym, przestrzeń pod schodami o wysokości mniejszej niż 220 cm powinna być obudowana lub oznaczona',
		],
	},
	{
		name: 'OPRAWA OŚWIETLENIOWA',
		content: ['9.5.1.Czy są zainstalowane bezpiecznie dla użytkowników', '9.5.2.Czy oświetlenie jest min. 100 lx'],
	},
]

const elementsData10 = [
	{
		name: '10',
		content: ['Lokalizacja'],
	},
	{
		name: 'UMIEJSCOWIENIE WINDY',
		content: [
			'10.1.1. Dźwig powinien znajdować się jak najbliżej wejścia do placówki.',
			'10.1.2. Drogę dotarcia do windy musi wskazywać informacja wizualna',
			'10.1.3. Otoczenie podnośnika zewnętrznego należy oświetlić światłem o natężeniu min. 30lx.',
			'10.1.4. Odległość między drzwiami windy a przeciwległą ścianą lub inną przegrodą musi wynosić co najmniej 160 cm poza obrysem otwarcia drzwi.',
			'10.1.5. Na dojściu do windy należy zastosować system fakturowy prowadzący do panelu zewnętrznego.',
		],
	},
	{
		name: 'WEJŚCIE DO WINDY',
		content: [
			'10.2.1.Różnica pozimów podłogi kabiny i posadzki na zewnątrz windy nie może być większa niż 2 cm.',
			'10.2.2.Po lewej lub prawej stronie drzwi windy należy umieścić informacje z numerem kondygnacji.',
			'10.2.3.Numery kondygnacji powinny być wykonane wypukłą, kontrastową czcionką i umieszczone na wysokości wzroku (od 145 do 165 cm.',
			'10.2.4.Drzwi windy oraz ich obramowanie powinny być kolorystycznie skontrastowane względem otoczenia',
			'10.2.5.Zaleca się aby winda była wyposażona w drzwi automatyczne',
		],
	},
	{
		name: 'PANEL ZEWNETRZNY',
		content: [
			'10.3.1.Przyciski panelu zewnętrznego powinny bć na wysokości 80-110 cm',
			'10.3.2.Panel zewnętrzny powinien być skontrastowany kolorystycznie względem otoczenia',
			'10.3.3.Jesli kilka wind jest obok siebie, ważne jest aby jeden panel obsługiwał tylko jedną windę.',
			'10.3.4.Jeśli w windzie zastosowano drzw uchylne panel zewnętrzny należy umieścić po stronie klamki.',
			'10.3.5.Panel zewnętrzny powinien mieć wypukłe przyciski, oznaczone w alfabecie Braillea oraz za pomocą wypukłych symboli',
			'10.3.6.Przyciki muszą mieć sygnalizację świetlną, która aktywuje się po naciśnięciu.',
			'10.3.7.Windę należy wyposażyć w sygnalizację informującą o przyjeździe windy i kierunku jazdy, dzwiękową oraz świetlną.',
		],
	},
	{
		name: 'KAMBINA WINDY',
		content: [
			'10.4.1.Drzwi do kabiny muszą mieć szerokość min. 90 cm.',
			'10.4.2.Kabina powinna być wyposażona w czujniki zamykania drzwi',
			'10.4.3.Minimalne wymiary kabiny to 110 do 140',
			'10.4.4.W kabinie po prawej i lewej stronie od wejścia należy zamontować poręcze. ',
			'10.4.5.Jeśli panel sterujący jest na tej samej ścianie co porecz, w poręczy musi być przerwa.',
			'10.4.6.Górna krawędź poręczy musi być zamontowana na wysokości 90 cm',
			'10.4.7.Odległość poręczy od ściany powinna wynosić min 5 cm',
			'10.4.8.Na scianie naprzeciw drzwi nalezy zamontować lustro - maksymalnie 40 cm nad podłogą i do wysokości minimalnej 190 cm. Montaż lustra nie dotyczy windy o powierzchni 150x150 cm, w których zastosowano przestrzeń manewrową.',
			'10.4.9.Zaleca się, aby kabina miała wymiary minimum 150 cm na 210 cm',
			'10.4.10.Dźwig osobowy można wyposażyć w składane siedzenie montowane na wysokości 50 cm od podłogi',
		],
	},
	{
		name: 'WEWNĘTRZNY PANEL STERUJĄCY',
		content: [
			'10.5.1.Przycisk panelu wewnętrznego należy zamontować na wysokości od 80 cm do 110 cm.',
			'10.5.2.Panel musi znajdować się w odległości minimum 50 cm od naroża kabiny przeciległego do drzwi. ',
			'10.5.3.W windzie przelotowej panele sterujące należy umieścić na obu ścianach kabiny.',
			'10.5.4.W windzie powinno być zainstalowane narżedzie do głosowego informowania o kierunku jazdy i o numerze piętra.',
			'10.5.5.W przypadku drzwi otwieranych centralnie panel należy montować po prawej stronie od wejścia. W przypadku drzwi otwieranych jednostronnie panel sterujący musi znajdować się po stronie zgodnej z kierunkiem zamykania drzwi.',
			'10.5.6.Przyciski piętrowe powinny się znajdować nad przyciskami alarmu i przyciskami funkcyjnymi',
			'10.5.7.W windzie obsługującej ponad 5 kondygnacji przyciski piętrowe należy rozmieścić mijankowo.',
			'10.5.8.Panel wewnętrzny powinien mieć wypukłe przyciski, oznaczone w alfabecie Braille’a oraz za pomocą wypukłych symboli.',
			'10.5.9.Przyciski muszą mieć sygnalizację świetlną, która aktywuje się po naciśnięciu',
			'10.5.10.Panel wewnętrzny należy skontrastować kolorystycznie względem ścian windy na poziomie LRV ≥ 60',
			'10.5.11.Przycisk wyjścia z budynku (parter, lobby, recepcja), oznaczony kolorem zielonym, powinien wystawać ponad pozostałe przyciski o minimum 5 mm',
			'10.5.12.Wymaga się, aby przycisk alarmu był oznaczony kolorem żółtym',
			'10.5.13.Zaleca się, aby sygnalizacja alarmowa umożliwiała komunikację z osobami głuchymi (połączenie wideo).',
		],
	},
]

const elementsData11 = [
	{
		name: '11',
		content: ['Lokalizacja'],
	},
	{
		name: 'POMIESZCZENIA HIGIENICZNO-SANITARNE',
		content: ['11.1.1. Umiejscowienie w budynku  opisowo'],
	},
	{
		name: 'TOALETY - PRZESTRZEŃ MANEWROWA',
		content: [
			'11.2.1.Obszar manewrowy o minimalnych wymiarach 150x150 cm',
			'11.2.2.Nie zachodzą elementy wyposażenia',
			'11.2.3.Wszystkie odpływy wody z poziomu posadzki powinny znajdować się poza przestrzenią manewrową wózka',
		],
	},
	{
		name: 'URZĄDZENIA ALARMOWE',
		content: [
			'11.3.1.Przycisk/ linka do wzywania pomocy na wysokości 40 cm od poziomu posadzki',
			'11.3.2.Uruchamianie urządzeń alarmowych w toalecie nie powinno wymagać siły przekraczającej 30 n',
		],
	},
	{
		name: 'POWIERZCHNIE ŚCIAN I PODŁÓG',
		content: [
			'11.4.1.Ściany i podłogi powinny być ze sobą skontrastowane',
			'11.4.2.Powierzchnie ścian oraz powierzchnie podłóg o kontraście kolorystycznym większym od lrv=30',
			'11.4.3.Podłogi i posadzki w toaletach powinny być wykonywane z materiałów antypoślizgowych',
		],
	},
	{
		name: 'DRZWI',
		content: [
			'11.5.1. Wejście do toalety powinno być oznaczone za pomocą piktogramów na ścianach oraz informacją w alfabecie braillea',
			'11.5.2. Drzwi otwierane na zewnątrz, o szerokości co najmniej 90 cm',
			'11.5.3. Zaleca się montowanie drzwi bez siłowników',
			'11.5.4. Ręczne otwieranie i zamykanie drzwi toalety nie powinno wymagać siły przekraczającej 60 n',
		],
	},
	{
		name: 'POZOSTAŁE ELEMENTY',
		content: [
			'11.6.1. Włączniki światła powinny się znajdować na wysokości 80  110 cm od poziomu posadzki',
			'11.6.2. Oświetlenie umożliwia korzystanie z pomieszczenia  min. 300 lx',
			'11.6.3. Wieszaki na ubrania na wysokości ok. 180 cm i przynajmniej jeden na wysokości ok. 110 cm',
		],
	},
	{
		name: 'MISKA USTĘPOWA - PRZESTRZEŃ MANEWROWA OBOK MUSZLI',
		content: [
			'11.7.1.Szerokości min. 90 cm (zalecana z obydwu stron)',
			'11.7.2.Górna krawędź deski powinna się znajdować na wysokości 42-48 cm',
			'11.7.3.Oś muszli nie bliżej niż 45 cm od ściany',
			'11.7.4.Deska klozetowa powinna być jednolita, bez wycięć, stabilna',
		],
	},
	{
		name: 'PORĘCZE',
		content: [
			'11.8.1. W odległości 30  40 cm od osi muszli',
			'11.8.2. Na wysokości 70-85 cm (górna krawędź poręczy)',
			'11.8.3. Wystające 10  15 cm przed muszlę',
		],
	},
	{
		name: 'SPŁUCZKA',
		content: [
			'11.9.1.Przycisk spłuczki powinien się znajdować z boku miski ustępowej na wysokości nieprzekraczającej 80  110 cm',
			'11.9.2.Podajnik papieru toaletowego powinien się znajdować na wysokości 60  70 cm od posadzki',
		],
	},
	{
		name: 'UMYWALKA',
		content: [
			'11.10.1. Górna krawędź na wysokości 75  85 cm od posadzki',
			'11.10.2. Dolna krawędź nie niżej niż 60  70 cm od posadzki',
			'11.10.3. Lustro: dolna krawędź nie wyżej niż 80 cm od poziomu posadzki lub bezpośrednio nad umywalką',
			'11.10.4. Dozownik mydła, suszarka/ręczniki: na wysokości 80  110 cm od poziomu posadzki',
		],
	},
	{
		name: 'PRZESTRZEŃ MANEWROWA',
		content: [
			'11.11.1. Przed umywalką o wymiarach 90x150cm',
			'11.11.2. Nie więcej niż 40 cm tej przestrzeni może znajdować się pod umywalką',
		],
	},
	{
		name: 'PORĘCZE',
		content: [
			'11.12.1. Montowane po obu stronach umywalki na wysokości 90  100 cm',
			'11.12.2. Odległość  nie mniejszej niż 5 cm pomiędzy krawędzią poręczy a umywalką',
		],
	},
	{
		name: 'WANNA - WYSOKOŚĆ',
		content: [
			'11.13.1. Wanny powinny być możliwie duże (umożliwiające hydroterapię), o minimalnych wymiarach 170x70 cm',
			'11.13.2. Wysokość górnej krawędzi nie powinna przekraczać 50 cm',
		],
	},
	{
		name: 'PRZESTRZEŃ MANEWROWA',
		content: [
			'11.14.1. Wynosić 140 cm x (długość wanny)',
			'11.14.2. Wanna powinna być przedłużona podestem lub wyposażona w ruchomą ławeczkę',
		],
	},
	{
		name: 'PORĘCZE',
		content: [
			'11.15.1. Na wysokości 70  90 cm od poziomu podłogi',
			'11.15.2. Długość poręczy powinna wynosić min. 60 cm',
		],
	},
	{
		name: 'PRYSZNIC - NATRYSK',
		content: [
			'11.16.1. Bezprogowa powierzchnia o wymiarach 150x150 cm',
			'11.16.2. Siedzisko prysznicowe z oparciem, mocowane do ściany, na wysokości 42  50 cm od podłogi',
			'11.16.3. Poręcze powinny być montowane na wysokości 90  100 cm nad poziomem podłogi',
			'11.16.4. Baterie z termostatem powinny znajdować się na wysokości 80  90 cm nad poziomem podłogi',
		],
	},
	{
		name: 'KABINA NIEZAMKNIĘTA',
		content: [
			'11.17.1. Minimalna szerokość 90 cm',
			'11.17.2. Minimalna powierzchnia kabiny 0,9 m2',
			'11.17.3. Minimalna powierzchnia manewrowa przed kabiną 90x120 cm2',
		],
	},
	{
		name: 'KABINA ZAMKNIĘTA',
		content: ['11.18.1. Minimalna szerokość 150 cm', '11.18.2.	Minimalna powierzchnia kabiny 2,5 m2'],
	},
	{
		name: 'SŁUCHAWKA PRYSZNICOWA',
		content: ['11.19.1. Długość co najmniej 150 cm', '11.19.2. Wysokość 90  210 cm nad poziomem podłóg'],
	},
]

const elementsData12 = [
	{
		name: '12',
		content: ['Lokalizacja'],
	},
	{
		name: 'POKOJE RODZICA Z DZIECKIEM',
		content: [
			'12.1.1.Zapewniono (wymagany w budynkach użyteczności publicznej o powierzchni powyżej 1000m²)',
			'12.1.2.Pomieszczenie dostosowane do przewijania i karmienia, odpowiednio wyposażone',
			'12.1.3.Przewijak na wysokości 0,8 do 0,85 m, pod nim pusta przestrzeń, o wymiarach nie mniejszych niż 50 na 70 cm, bez ostrych krawędzi,  z zabezpieczeniem zapobiegającym zsuwaniu się dziecka',
		],
	},
]

const elementsData13 = [
	{
		name: '13',
		content: ['Lokalizacja'],
	},
	{
		name: 'PRZESTRZEŃ MANEWROWA',
		content: [
			'13.1.1. Szerokość drzwi co najmniej 90 cm',
			'13.1.2. Zapewniona przestrzeń manewrowa - pełen obrót (średnica koła wózka) - 160x160 cm.',
		],
	},
	{
		name: 'BIURKO I INNE WYPOSAŻENIE',
		content: [
			'13.2.1. Odpowiednie miejsce dla osoby poruszającej się na wózku inwalidzkim: Wysokość blatu biurka lub stołu od 60 cm do 80 cm, przestrzeń na nogi pod biurkiem.',
			'13.2.2. Odpowiednie miejsce dla osoby poruszającej się na wózku inwalidzkim: Wysokość blatu biurka lub stołu od 60 cm do 80 cm, przestrzeń na nogi pod biurkiem.',
		],
	},
	{
		name: 'OŚWIETLENIE',
		content: [
			'13.3.1. Oświetlenie w pomieszczeniu jest równomierne, w salach lekcyjnych oświetlenie od góry.',
			'13.3.2. Włączniki światła przewidziano na wysokości 0,8-1,1 m',
			'13.3.3. Oświetlenie umożliwia korzystanie z pomieszczenia - min. 300 lx',
		],
	},
	{
		name: 'OKNA',
		content: [
			'13.4.1. Okna w pomieszczeniu biurowym: Klamka w postaci dźwigni na wysokości 85-120 cm nad poziomem podłogi,	Klamka w kontrastujących barwach w stosunku do tła',
			'13.4.2. Okna w pomieszczeniu przeznaczonym na pobyt dzieci: zabezpieczenia przeciw wypadnięciu',
			'13.4.3. Brak poprzecznych podziałów okiennych między wysokością 80 a 150 cm od poziomu podłogi',
		],
	},
	{
		name: 'GNIAZDA, KONTAKTY I INNE MECHANIZMY KONTROLNE',
		content: [
			'13.5.1. W pomieszczeniach biurowych: Kontakty i inne mechanizmy kontrolne na wysokości 80 - 110 cm, 		Gniazda na wysokości 40-100 cm',
			'13.5.2. W pomieszczeniach przeznaczonych na przebywanie dzieci:wszystkie urządzenia elektryczne powinny znajdować się poza zasięgiem dzieci lub powinny być odpowiednio zabezpieczone,',
			'13.5.3. Włączniki oświetleniowe na ścianie od strony klamki w odległości ok. 20 cm od otworu drzwiowego',
		],
	},
	{
		name: 'DRZWI WEWNĘTRZNE',
		content: [
			'13.6.1. Szerokość skrzydła drzwi większa niż 90 cm (bez pom. Technicznych)',
			'13.6.2. Kontrastowe ościeżnice',
			'13.6.3. Wyróżniająca się klamka',
			"13.6.4. Info w alfabecie braille'a na 120 cm",
			'13.6.5. Nr pokoju wyrazisty, Na wysokości 145-165 cm',
		],
	},
	{
		name: 'ZABEZPIECZENIA',
		content: ['13.7.1. Zabezpieczenia stałych elementów wyposażenia.'],
	},
	{
		name: 'ZALECENIA',

		content: [''],
	},
]

const elementsData14 = [
	{
		name: '14',
		content: ['Lokalizacja'],
	},
	{
		name: 'OZNAKOWANIE PIĘTER',
		content: ['14.1.1.Wysokość 1,2-1,4 m', '14.1.2.Na piętrze umieszczony w widocznym, łatwym do odnalezienia miejscu'],
	},
	{
		name: 'PLAN EWAKUACJI',
		content: [
			'14.2.1.Powieszony na wysokości 1,2-1,4 m',
			'14.2.2.Na piętrze umieszczony w widocznym, łatwym do odnalezienia miejscu',
		],
	},
	{
		name: 'INFORMACJA O LICZBIE ORAZ MIEJSCU PRZEBYWANIA OSÓB OGRANICZONEJ MOŻLIWOŚCI PORUSZANIA SIĘ',
		content: ['14.3.1.Informacja o liczbie oraz miejscu przebywania osób o ograniczonej możliwości poruszania się'],
	},
	{
		name: 'MIEJSCA OCZEKIWANIA OSÓB Z NIEPEŁNOSPRAWNOŚCIĄ NA EWAKUACJĘ Z OBIEKTU',
		content: [
			'14.4.1.Zlokalizowane na klatkach schodowych',
			'14.4.2.Miejsce oczekiwania nie może ograniczać szerokości drogi ewakuacji',
			'14.4.3.Wyposażone w środki gaśnicze, koce ochronne i specjalne siedzisko do ewakuacji osób o ograniczonych możliwościach ruchowych',
			'14.4.4.Wyposażone w urządzenia komunikacji, pozwalające na dwukierunkową łączność ze służbami odpowiedzialnymi za ewakuacji',
			'14.4.5.Przeszkolenie osób odpowiedzialnych za ewakuację z zasad dotyczących ewakuacji osób z ograniczoną możliwością poruszania się',
		],
	},
	{
		name: 'OCHRONA PRZECIWPOŻAROWA',
		content: [
			'14.5.1.Systemy sygnalizacji pożarowej sygnalizatorów świetlnych i akustycznych',
			'14.5.2.Drzwi ewakuacyjne oznaczone na kolor żółty, czyli o największym kontraście względem otoczenia',
			'14.5.3.Dodatkowa oprawa oświetleniowa nad wyjściami ewakuacyjnymi',
			'14.5.4.Znaki bezpieczeństwa dotyczące ewakuacji oświetlone wewnętrznie',
			'14.5.5.Wyposażenie holu windowego w intercom pożarowy z przekierowaniem do pomieszczenia ochrony',
		],
	},
	{
		name: 'DROGI EWAKUACYJNE',
		content: [
			'14.6.1.Brak stopni i progów na drogach ewakuacyjnych',
			'14.6.2.Zastosowano czytelną informację o drogach ewakuacji w formie  strzałek, piktogramów',
		],
	},
]

const elementsData15 = [
	{
		name: '15',
		content: ['Lokalizacja'],
	},
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
		name: '16',
		content: ['Lokalizacja'],
	},
	{
		name: 'MATERIAŁY WYKOŃCZENIOWE',
		content: [
			'16.1.1.W hałaśliwych przestrzeniach, gdzie dźwięki są zniekształcone i trudno zrozumieć przekazywaną mowę, stosuje się materiały wykończeniowe zaprojektowane do pochłaniania dźwięków. Przykłady takich materiałów to dywany, sufity akustyczne, panele akustyczne, perforowane przegrody, zasłony materiałowe oraz tapicerowane meble.',
			'16.1.2.Jeśli na drzwiach i przegrodach ponad 75% powierzchni stanowią materiały przezroczyste, wymagane są widoczne oznaczenia. W przypadku przegród przezroczystych zamiast stosowania oznaczeń, można ograniczyć dostęp do nich poprzez odpowiednie zagospodarowanie przestrzeni.',
		],
	},
]

const elementsData17 = [
	{
		name: '17',
		content: ['Lokalizacja'],
	},
	{
		name: 'Dział 1. Dostępność architektoniczna',
		content: [
			'1 Czy podmiot zapewnia obsługę z wykorzystaniem środków wspierających komunikowanie się ?',
			'2 Czy podmiot zatrudnia przynajmniej jedną osobę posługującą się językiem migowym ?',
			'3.1 Czy podmiot zapewnia dostęp do usługi tłumacza online przez strony internetowe bądź aplikacje ?',
			'3.2 Aplikacje tłumaczące język migowy',
			'3.3 Dostęp do strony internetowej tłumaczacej język migowy',
			'4.1 Czy w budynku podmiotu są zainstalowane urządzenia lub inne środki techniczne do obsługi osób słabosłyszących ?',
			'4.2 Pętla indukcyjna',
			'4.3 System FM',
			'4.4 System na podczerwieć (IR)',
			'4.5 Inne urządzenia/systemy oparte o inne technologie, których celem jest wspomaganie słyszenia',
			'5 Czy podmiot zapewnia na swojej stronie internetowej informacje o zakresie jego działalności - w postaci elektronicznego pliku zawierającego tekst odczytywalny maszynowo (PJM, ETR) ?',
			'6 Czy podmiot zapewnia na swojej stronie internetowej informacje o zakresie jego działalności - w postaci nagrania treści w polskim języku migowym ?',
			'7 Czy podmiot zapewnia na swojej stronie internetowej informacje o zakresie jego działalności w tekście łatwym do czytania ?',
			'8 Czy podmiot zapewnił, na wniosek osoby ze szczeglnymi potrzebami, możliwości komunikacji z podmiotem publicznym w formie określonej w tym wniosku ?',
			'9 Czy podmiot zapewnia podstawowy środek komunikowania się osób głuchoniewidomych (SKOGN), w którym sposób przekazu komunikatu jest dostosowany do potrzeb wynikających z łącznego występowania dysfunkcji narządu wzroku i słuchu ?',
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
	elementsData17,
}
