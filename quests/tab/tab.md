# 使用 Tab 自動補全

在這個關卡，你將會學到

1. 如何使用 Tab 自動補全路徑
2. 出現衝突時如何處理

按下中間的按鈕來開始這個關卡。

---

在終端機裡，所有的操作都是用文字進行。
然而，打字很花時間，而且只要一個字打錯，指令就會執行失敗。
因些終端機提供「自動補全」的功能，自動幫你完成檔案路徑、指令名稱、參數名稱，節省你的時間，也避免輸入錯誤。

在開始練習之前，我們先來看看家目錄下有哪些檔案。

> 使用 `ls` 查看檔案列表

---

你看到了這個資料夾中充滿了超級長和有錯字的檔案名稱，如果這些都要我們一個一個字輸入，肯定會很痛苦。
但不要緊，只要使用自動補全，檔名不論多長都能輕鬆輸入。

使用自動補全的方法是，**先輸入部分的檔名，再按下 Tab**
（Tab 是 Q 左邊的按鍵）
例如要補全 `SuperSecretPlansForWorldDomination.txt`，你可以先輸入 `Su` 再按下 Tab，終端機就會幫你打完剩下的檔名了。

我們試看看印出 `SuperSecretPlansForWorldDomination.txt` 這個檔案的內容。

> 使用 `cat SuperSecretPlansForWorldDomination.txt` 來印出檔案內容
> 在輸入 `cat Su` 之後按下 Tab 來自動補全檔名，完成後按 Enter 就能執行指令

---

你看到了終端機自動幫你補全了 `SuperSecretPlansForWorldDomination.txt`，就算是很長的檔名，也不用怕打錯字。
開頭不論你打了幾個字都無所謂，你可以只打 `S`、`Su`、`Sup`、`Super` 或甚至完全不打字都沒關係。
但是你打的字越少，就越容易跟其他的檔案重複，這時候就要做衝突處理。
關於衝突處理，我們會在待會練習。

讓我們再練習一個，這次請你查看 `ThingsIWillOrganizeLaterWhenIHaveTime` 資料夾中的檔案。
一樣，輸入前幾個字，然後按 Tab 自動補全。

> 輸入 `ls ThingsIWillOrganizeLaterWhenIHaveTime` 進入到該資料夾
> 輸入 `ls Thing` 之後按下 Tab 做自動補全
> 試試看輸入更少的字元就按 Tab 會有什麼樣的結果

---
