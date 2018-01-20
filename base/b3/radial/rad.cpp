#include <bits/stdc++.h>
#define f first
#define s second
/*
 	This code generate the input for the base chart number 3.
*/

using namespace std;
int radius ;
const int maxValue = 1000;
const int width = 1000;
const int height = 1000;
const int delta = 0;
const double PI = acos(-1);

struct house{
	int x,y;
	string name;
	int c; // consumption;
	house(){}
	house(string _name, int _c){
		c = _c;
		name = _name;
	}
	bool operator < ( const house aux ) const{
		return c < aux.c;
	}
	void show(){
		printf("%s,%d,%d,%d\n", name.c_str(), radius,x, y);
	}
};

typedef vector < house > vic;
typedef pair < int , int > ii;
typedef vector < ii > vi;

int getBask(int n){
	float bask = float(n)/float(maxValue)*10.0;
	return (int) bask;
}

bool collide(vic &circles, int x, int y){
 	for(house c: circles ){
 		if(c.x == 0 && c.y == 0 ) continue;
 		if( pow(x-c.x, 2) + pow(y-c.y, 2) <  pow(2*radius, 2)) return true;
	}
	return false;
}

void rotate(double &nx, double &ny, double a){
	double x = nx, y =ny;
	double  t = a * PI / 180.0;
  nx = x * cos(t) - y * sin(t);
  ny = x * sin(t) + y * cos(t);
}

void generateRadial(vic &houses, vi &baskets){
	double posx = 0 , posy=0;
	int n  = houses.size();
	double angle ;//= 360/houses.size();
	double t = 0;
	for ( int i = 0 ; i < n ; i++ ){
		posy = houses[i].c, posx = 0;
		angle = 360 / baskets[getBask(posy)].f++;
		int bask = getBask(houses[i].c);
		ii &b  = baskets[bask];
		rotate(posx , posy, t);
		t+= angle;
		while(collide(houses, posx, posy)){
			t = (int)t%360;
			t+= angle;
			rotate(posx,posy, t);
		}
		houses[i].y = posy;
		houses[i].x = posx;
	}
}

int main(){
	#ifdef LOCAL
		freopen("new.c", "r", stdin);
		freopen("out.c", "w", stdout);
	#endif

	int numHouses;
	cin >> numHouses;
	vic houses(numHouses);
	radius = int(26*15/numHouses);

	string name;
	int consumption;
	vi baskets(numHouses+1);
	for( int i =0; i < numHouses; i++){
		cin >> name >> consumption;
		houses[i].name = name;
		houses[i].c = consumption;
		baskets[getBask(consumption)].f++;
	}
	sort(houses.begin(), houses.end());
	generateRadial(houses, baskets);
	cout << "name,radius,x,y\n";
	for (house a : houses){
		a.show();
	}
	return 0;
}
