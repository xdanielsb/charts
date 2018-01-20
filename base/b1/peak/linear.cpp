#include <bits/stdc++.h>
/*
 	This code generate the input for the base chart number 1.
*/

using namespace std;
const int radius = 15;

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
		//printf("%s :  (%d, %d)\n", name.c_str(), x,y);
		printf("%s,%d,%d\n", name.c_str(), radius, y);
	}
};

typedef vector < house > vic;

void generateStairs(vic &houses){
	int posx = 0;
	int n  = houses.size();
	for ( int i = 0 ; i < n ; i++ ){
		houses[i].y =  houses[i].c;
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

	string name;
	int consumption;
	for( int i =0; i < numHouses; i++){
		cin >> name >> consumption;
		houses[i].name = name;
		houses[i].c = consumption;
	}
	generateStairs(houses);
	cout << "name,radius,y\n";
	for (house a : houses){
		a.show();
	}

	return 0;
}
