package koyomi

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"time"
)

var JST, _ = time.LoadLocation("Asia/Tokyo")

type Holiday struct {
	Name  string `json:"name"`
	Year  int    `json:"year"`
	Month int    `json:"month"`
	Date  int    `json:"date"`
}

type NewMoon struct {
	Year  int `json:"year"`
	Month int `json:"month"`
	Date  int `json:"date"`
}

type Term struct {
	Name  string `json:"name"`
	Year  int    `json:"year"`
	Month int    `json:"month"`
	Date  int    `json:"date"`
}

type Kyureki struct {
	Year   int
	Month  int
	Date   int
	IsLeap bool
	Rokuyo string
}

var chukiNames = []string{
	"雨水",
	"春分",
	"穀雨",
	"小満",
	"夏至",
	"大暑",
	"処暑",
	"秋分",
	"霜降",
	"小雪",
	"冬至",
	"大寒",
}

var rokuyoNames = []string{
	"先勝",
	"友引",
	"先負",
	"仏滅",
	"大安",
	"赤口",
}

var JSONFileCache = make(map[string][]byte)

func LoadJSONFile[T Holiday | NewMoon | Term](year int, fileName string) []T {
	var content []byte
	k := strconv.Itoa(year) + fileName
	raw, ok := JSONFileCache[k]
	if !ok {
		raw, err := ioutil.ReadFile("../../../data/" + strconv.Itoa(year) + "/" + fileName)
		if err != nil {
			fmt.Println(err.Error())
			os.Exit(1)
		}
		content = raw
		JSONFileCache[k] = content
	} else {
		content = raw
	}

	var data []T
	json.Unmarshal(content, &data)
	return data
}

func NewKyureki(t time.Time) Kyureki {
	year := t.Year()
	// month := int(t.Month())
	// day := t.Day()

	var kyurekiYear int = year
	var kyurekiMonth int = 0
	var kyurekiDate int

	var newmoons = append(
		LoadJSONFile[NewMoon](year-1, "newmoons.json"),
		LoadJSONFile[NewMoon](year, "newmoons.json")...,
	)
	var terms = append(
		LoadJSONFile[Term](year-1, "terms.json"),
		LoadJSONFile[Term](year, "terms.json")...,
	)
	var chuki []Term
	for _, term := range terms {
		for _, chukiName := range chukiNames {
			if chukiName == term.Name {
				chuki = append(chuki, term)
				break
			}
		}
	}
	var newmoon time.Time
	var nextNewmoon time.Time
	for i := 0; i < len(newmoons); i += 1 {
		d0 := time.Date(newmoons[i].Year, time.Month(newmoons[i].Month), newmoons[i].Date, 0, 0, 0, 0, JST)
		var d1 time.Time
		if i == len(newmoons)-1 {
			d1 = time.Date(t.Year()+1, 1, 1, 0, 0, 0, 0, JST)
		} else {
			d1 = time.Date(newmoons[i+1].Year, time.Month(newmoons[i+1].Month), newmoons[i+1].Date, 0, 0, 0, 0, JST)
		}
		if t.Equal(d0) || (t.After(d0) && t.Before(d1)) {
			newmoon = d0
			nextNewmoon = d1
			break
		}
	}
	diff := t.Sub(newmoon).Hours() / 24
	kyurekiDate = 1 + int(diff)

	isLeapMonth := true
	for i := 0; i < len(chuki); i += 1 {
		c := time.Date(chuki[i].Year, time.Month(chuki[i].Month), chuki[i].Date, 0, 0, 0, 0, JST)
		if c.Equal(newmoon) || (c.After(newmoon) && c.Before(nextNewmoon)) {
			for m, chukiName := range chukiNames {
				if chuki[i].Name == chukiName {
					if chukiName == chukiNames[len(chukiNames)-1] {
						kyurekiYear = chuki[i].Year - 1
					} else {
						kyurekiYear = chuki[i].Year
					}
					kyurekiMonth = m + 1
					isLeapMonth = false
					break
				}
			}
			break
		} else if c.After(nextNewmoon) || c.Equal(nextNewmoon) {
			for m, chukiName := range chukiNames {
				if chuki[i].Name == chukiName {
					if chukiName == chukiNames[len(chukiNames)-1] {
						kyurekiYear = chuki[i].Year - 1
					} else {
						kyurekiYear = chuki[i].Year
					}
					kyurekiMonth = m
					break
				}
			}
			break
		}
	}

	rokuyo := rokuyoNames[(kyurekiMonth+kyurekiDate+4)%6]

	fmt.Println(year, month, day, "/", kyurekiYear, kyurekiMonth, kyurekiDate, isLeapMonth, rokuyo)
}

func main() {
  var terms = LoadJSONFile[Term](2021, "terms.json")
  var newmoons = LoadJSONFile[NewMoon](2021, "newmoons.json")
	fmt.Println(terms)
	fmt.Println(newmoons)
}
