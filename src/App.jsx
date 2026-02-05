import './App.css'


function App() {
  return (
    <div className="wedding-site">
      {/* Navigation */}
      <nav className="nav">
        <a href="#home">Home</a>
        <a href="#greetings">Greetings</a>
        <a href="#information">Information</a>
        <a href="#access">Access</a>
        <a href="#rsvp">RSVP</a>
      </nav>

      {/* Home Section */}
      <section id="home" className="section hero">
        <h1 className="title">Halko & Ryo</h1>
        <p className="subtitle">we are saying "I do"</p>
        
        <div className="photo-frame">
          <img 
            src="img_dressed.png" 
            alt="Halko & Ryo" 
            className="couple-photo"
          />
        </div>
        
        <p className="date">4.29.2026</p>
        <p className="venue-short">Angepatio, Shibuya</p>
      </section>

      {/* Greetings Section */}
      <section id="greetings" className="section">
        <h2 className="section-title">Greetings</h2>
        <div className="divider"></div>
        
        <div className="greeting-text">
          <p>謹啓</p>
          <p>
            早春の候 皆様におかれましては<br />
            益々ご清祥のことと<br />
            お慶び申し上げます
          </p>
          <p>
            このたび 私たちは<br />
            結婚式を挙げることとなりました<br />
            おいそがしいことと存じますが<br />
            ぜひご参列いただき<br />
            日頃お世話になっております<br />
            皆様と一緒に<br />
            喜びのひとときを過ごさせていただければ<br />
            幸いに存じます
          </p>
          <p>
            式後ささやかではございますが<br />
            小宴を催したく存じますので<br />
            ぜひご出席賜りますよう<br />
            お願い申し上げます
          </p>
          <p>謹白</p>
          <p className="greeting-names">Halko & Ryo</p>
        </div>
      </section>

      {/* Information Section */}
      <section id="information" className="section">
        <h2 className="section-title">Information</h2>
        <div className="divider"></div>
        
        <div className="info-block">
          <h3>挙式日</h3>
          <p>2026年4月29日（水・祝）</p>
        </div>

  <div className="schedule">
  {/* 12:00 受付 */}
  <div className="schedule-item">
    <div className="time-column">
      <span className="time">12:00</span>
    </div>
    <div className="icon-column">
      <div className="schedule-image-container">
        {/* ic_clink.png を使用 */}
        <img src="/ic_clink.png" alt="Welcome" className="schedule-icon-img" />
      </div>
    </div>
    <div className="content-column">
      <span className="label">受付・ウェルカムドリンク</span>
      <p className="schedule-detail">
        挙式までの時間をゆっくり過ごしていただけるよう、<br />
        ささやかなお飲み物と軽食をご用意してお待ちしております。
      </p>
      <p className="schedule-detail">
        お早めに到着された方や、ゲスト同士のご歓談を楽しみたい方は、<br />
        12:00-13:50の間のお好きな時間にお越しください。
      </p>
      <p className="schedule-note">
        ※皆様の状況に合わせて 自由なタイミングでご来場いただければ幸いです
      </p>
    </div>
  </div>

  {/* 14:00 挙式 */}
  <div className="schedule-item">
    <div className="time-column">
      <span className="time">14:00</span>
    </div>
    <div className="icon-column">
      <div className="schedule-image-container">
        {/* ic_ring.png を使用 */}
        <img src="/ic_ring.png" alt="Ceremony" className="schedule-icon-img" />
      </div>
    </div>
    <div className="content-column">
      <span className="label">挙式</span>
    </div>
  </div>

  {/* 14:30 撮影・歓談 */}
  <div className="schedule-item">
    <div className="time-column">
      <span className="time">14:30</span>
    </div>
    <div className="icon-column">
      <div className="schedule-image-container">
        {/* ic_camera.png を使用 */}
        <img src="/ic_camera.png" alt="Photo" className="schedule-icon-img" />
      </div>
    </div>
    <div className="content-column">
      <span className="label">撮影・歓談</span>
    </div>
  </div>

  {/* 15:30 披露宴 */}
  <div className="schedule-item">
    <div className="time-column">
      <span className="time">15:30</span>
    </div>
    <div className="icon-column">
      <div className="schedule-image-container">
        {/* ic_catrary.png を使用 */}
        <img src="/ic_catrary.png" alt="Party" className="schedule-icon-img" />
      </div>
    </div>
    <div className="content-column">
      <span className="label">披露宴</span>
    </div>
  </div>

  {/* 17:30 お開き */}
  <div className="schedule-item">
    <div className="time-column">
      <span className="time">17:30</span>
    </div>
    <div className="icon-column">
      <div className="schedule-image-container">
        {/* ic_farewel.png を使用 */}
        <img src="/ic_farewel.png" alt="Closing" className="schedule-icon-img" />
      </div>
    </div>
    <div className="content-column">
      <span className="label">お開き</span>
    </div>
  </div>
</div>

        <div className="dress-code">
          <div className="dress-icon">👔</div>
          <h3>ドレスコード</h3>
          <p>
            セミフォーマルでお越しください。<br />
            カジュアルすぎない服装でお願いいたします。
          </p>
        </div>
      </section>

      {/* Access Section */}
      <section id="access" className="section">
        <h2 className="section-title">Access</h2>
        <div className="divider"></div>
        
        <div className="venue-info">
          <div className="venue-icon">📍</div>
          <h3>アンジェパティオ</h3>
          <p>〒150-0002 東京都渋谷区渋谷1-2-3</p>
        </div>

        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7479754683745!2d139.7016358!3d35.6580339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b563b00109f%3A0x337328def1e2ab26!2z5riL6LC36aeF!5e0!3m2!1sja!2sjp!4v1699000000000!5m2!1sja!2sjp"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="会場マップ"
          ></iframe>
        </div>

        <div className="access-detail">
          <p>🚃 JR渋谷駅 東口より徒歩5分</p>
          <p>🚃 東京メトロ渋谷駅 B2出口より徒歩3分</p>
        </div>
      </section>

      {/* RSVP Notice */}
      <section className="section rsvp-notice">
        <div className="notice-icon">💌</div>
        <h3>出席のご案内</h3>
        <p>ご出席いただける方は<br />以下よりご回答ください</p>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="section rsvp">
        <h2 className="section-title">RSVP</h2>
        <div className="divider"></div>
        
        <p className="rsvp-deadline">
          お手数ですが、ご出席いただける場合は2026年3月29日までにご返信ください。<br />
          お待ちしております。
        </p>

        <p className="rsvp-deadline-date">2026年3月26日</p>
        <p className="rsvp-note">
          期日までのご返信が難しい場合は、ご一報いただけますと幸いです。
        </p>

        <form className="rsvp-form" onSubmit={(e) => e.preventDefault()}>
          <h3 className="form-section-title">大人の方</h3>
          
          <div className="form-group">
            <label>ご芳名をお知らせください</label>
            <div className="radio-group">
              <label><input type="radio" name="attendance" value="attend" /> ご出席</label>
              <label><input type="radio" name="attendance" value="decline" /> ご欠席</label>
            </div>
          </div>

          <div className="form-group">
            <label>お名前（様）</label>
            <input type="text" placeholder="" />
          </div>

          <div className="form-group">
            <label>返信用お名前（様）</label>
            <input type="text" placeholder="例: 山田太郎" />
            <small>返信用お名前は「様」を除きます</small>
          </div>

          <div className="form-group">
            <label>ご住所</label>
            <input type="text" placeholder="" />
          </div>

          <div className="form-group">
            <label>人数</label>
            <input type="number" min="1" max="10" placeholder="1" />
          </div>

          <div className="form-group">
            <label>アレルギーの有無</label>
            <div className="radio-group">
              <label><input type="radio" name="allergy" value="none" /> アレルギーなし</label>
              <label><input type="radio" name="allergy" value="has" /> アレルギーあり</label>
            </div>
          </div>

          <div className="form-group">
            <label>送迎バスの利用</label>
            <div className="radio-group">
              <label><input type="radio" name="bus" value="use" /> 利用する</label>
              <label><input type="radio" name="bus" value="nouse" /> 利用しない</label>
            </div>
          </div>

          <div className="form-group">
            <label>メッセージ（任意）</label>
            <textarea rows="4" placeholder="お二人へのメッセージをどうぞ"></textarea>
          </div>

          <button type="submit" className="submit-btn">送信</button>
        </form>

        <h3 className="form-section-title">お子様</h3>
        <div className="form-group">
          <label>お子様（様）</label>
          <input type="text" placeholder="" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h2 className="footer-title">Halko & Ryo</h2>
        <p className="footer-date">📅 2026.04.29 wedding</p>
        <p className="copyright">© 2026 by Halko & Ryo</p>
      </footer>
    </div>
  )
}

export default App