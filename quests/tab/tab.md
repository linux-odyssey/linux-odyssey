# 使用 Tab 自動補全

在這個關卡，你將會學到

1. 如何使用 Tab 自動補全路徑
2. 出現衝突時如何處理

按下中間的按鈕來開始這個關卡。

---

在終端機裡，所有的操作都是用文字進行。
然而，打字很花時間，而且只要一個字打錯，指令就會執行失敗。
因此終端機提供「自動補全」的功能，自動幫你完成檔案路徑、指令名稱、參數名稱，節省你的時間，也避免輸入錯誤。

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

自動補全也可以用來對付拼字錯誤，像是 `ThsisAFlieNmaeWthAloOfTpyosThatisRleayHdToRaed.txt` 這個檔案充滿了錯字，任誰來打都難保不會失手。
這一次，請你一樣用 `cat` 來試著印出 `ThsisAFlieNmaeWthAloOfTpyosThatisRleayHdToRaed.txt` 的內容。

> 輸入 `cat ThsisAFlieNmaeWthAloOfTpyosThatisRleayHdToRaed.txt` 來印出檔案內容
> 輸入 `cat Thsi` 之後按下 Tab 做自動補全
> 試試看輸入更少的字元就按 Tab 會有什麼樣的結果

---

你看到了這個充滿錯字的檔案了。
只要使用自動補全，不管是錯字、大小寫變化、還是隨機亂碼都不再是困擾了。
讓我們再練習一個，這次請你查看 `ThingsIWillOrganizeLaterWhenIHaveTime` 資料夾中的檔案。
一樣，輸入前幾個字，然後按 Tab 自動補全。

> 輸入 `ls ThingsIWillOrganizeLaterWhenIHaveTime` 查看資料夾中的檔案
> 輸入 `ls Thing` 之後按下 Tab 做自動補全

---

你看到了這個資料夾裡有著三個檔案：一個如何做三明治的教學跟兩個在半夜隨機下載的東西。
假如我們要打開三明治教學 `HowToProperlyMakeASandwich.txt`，但是它位在資料夾中，我們沒辦法只按一次 Tab 就補全它的檔名。
這次我們就要來練習使用**連續的自動補全**。

像這樣檔案位在其他資料夾的情況，我們只要先輸入資料夾名稱的開頭，按一次 Tab，再輸入檔案的開頭，再按一次 Tab，就能夠補全 `資料夾/檔名` 了。
而且當你補全的對象是資料夾時，終端機還會自動幫你在結尾加上 `/`，省去你自己輸入的時間。
那麼我們就來打開 `HowToProperlyMakeASandwich.txt`。

> 輸入 `cat ThingsIWillOrganizeLaterWhenIHaveTime/HowToProperlyMakeASandwich.txt` 來印出檔案內容
> 先輸入 `cat Thin` 按 Tab 補全至 `cat ThingsIWillOrganizeLaterWhenIHaveTime/`
> 再輸入 `cat ThingsIWillOrganizeLaterWhenIHaveTime/How` 按 Tab 補全至完整路徑

---

你看到了這份嚴謹的三明治製作教學。
那我們剩下來要看的就是資料夾裡的兩個檔案：`RandomStuffThatIDownloadedAt3AM.txt` 和 `RandomStuffThatIDownloadedAt4AM.txt`
兩個檔名非常相似，只有最後一個是 3AM 另一個是 4AM。
這樣我們只打前面幾個字的時候，沒有辦法分辦到底選的是哪一個檔案。
這就是**發生衝突**。

遇到衝突的解決方法，其實跟使用資料夾是一樣的。
在輸入 `Ran` 按下 Tab 後，終端機會補全到衝突發生前的位置，也就是 `RandomStuffThatIDownloadedAt`。
我們只要根據我們想開啟的檔案，輸入 `3` 或是 `4`，再按一下 Tab，就能夠補全剩下的檔名了。

_如果我們把完整的路徑視作補全的對象，那資料夾其實就是一種衝突的情況。_

> 輸入 `cat ThingsIWillOrganizeLaterWhenIHaveTime/RandomStuffThatIDownloadedAt3AM.txt` 來印出檔案內容
> 先輸入 `cat Thin` 按 Tab 補全至 `cat ThingsIWillOrganizeLaterWhenIHaveTime/`
> 再接續輸入 `Ran` 按 Tab 補全至 `cat ThingsIWillOrganizeLaterWhenIHaveTime/RandomStuffThatIDownloadedAt`
> 再接續輸入 `3` 後按 Tab 補全至完整的路徑。

---

你看到了一份凌晨三點下載的檔案列表。嗯…我今天網路用的夠多了。
最後留下一個挑戰給你，請先進入到 `ThingsIWillOrganizeLaterWhenIHaveTime` 資料夾後，再印出 `RandomStuffThatIDownloadedAt4AM.txt`。
練習使用今天教的自動補全來完成任務。
