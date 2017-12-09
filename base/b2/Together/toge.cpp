#include <bits/stdc++.h>
#define f first
#define s second
/*
 	This code generate the input for the base chart number 2.
*/

using namespace std;
int radius ;
const int maxValue = 1000;
const int width = 1000;
const int height = 1000;
const int delta = 0;

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
 	for( house c: circles ){
 		if(c.x == 0 && c.y == 0 ) continue;
 		if( pow(x-c.x, 2) + pow(y-c.y, 2) <  pow(2*radius, 2)) return true;
	}
	return false;
}

void generateTogether(vic &houses, vi &baskets){
	int cont = 0;
	int posx = 0 , posy=0;
	int n  = houses.size();
	for ( int i = 0 ; i < n ; i++ ){
		int bask = getBask(houses[i].c);
		ii &b  = baskets[bask];
		posy = houses[i].c;
		if( b.s == 0 ){
			posx =  width / 2;
		}else if( b.s & 0x01 ){
			posx =  width / 2  + 2*radius*((b.s+1)/2)  +delta*(b.s+1);
		}else{
			posx =  width / 2 - 2*radius*(b.s/2)  - delta*(b.s+1);
		}
		if(bask & 0x01 && false){
			if( b.s & 0x01 ) posx += radius;
			else posx -= radius;
		}
		while(collide(houses, posx, posy)){
			cout << "collide\n";
			if( b.s & 0x01 ){
				posx += delta;
			}else{
				posx -=	delta;
			}
		}
		houses[i].y = posy;
		houses[i].x = posx;
		b.s++;
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
	radius = int(26*50/numHouses);
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
	generateTogether(houses, baskets);
	cout << "name,radius,x,y\n";
	for (house a : houses){
		a.show();
	}
	return 0;
}
