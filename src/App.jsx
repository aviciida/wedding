import './App.css'

import React, { useState } from 'react';

const RSVPForm = () => {
  // ゲスト1人分の初期データ構造
  const createInitialGuest = (type = 'adult') => ({
    id: Date.now() + Math.random(),
    type: type,
    attendance: '', // 'attend' or 'decline'
    firstName: '',
    lastName: '',
    kanaFirstName: '',
    kanaLastName: '',
    enFirstName: '',
    enMiddleName: '',
    enLastName: '',
    isDriving: false,
    arrivalTime: '',
    hasAllergy: false,
    allergyList: [{ food: '', noExtract: false, noHeat: false }],
    hasDietaryNeed: false,
    dietaryOptions: [],
    dietaryOtherText: '',
    childAge: '',
    childMeal: '',
    childSeat: ''
  });

  const [guests, setGuests] = useState([createInitialGuest('adult')]);
  const [email, setEmail] = useState('');

  const addGuest = (type) => {
    setGuests([...guests, createInitialGuest(type)]);
  };

  const updateGuest = (id, field, value) => {
    setGuests(guests.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  // ゲスト削除用関数
  const removeGuest = (id) => {
    // 1人しかいない場合は消せないようにガード
    if (guests.length <= 1) return;
    setGuests(guests.filter(g => g.id !== id));
  };

  const handleDietaryChange = (guestId, option) => {
    setGuests(guests.map(g => {
      if (g.id === guestId) {
        const newOptions = g.dietaryOptions.includes(option)
          ? g.dietaryOptions.filter(o => o !== option)
          : [...g.dietaryOptions, option];
        return { ...g, dietaryOptions: newOptions };
      }
      return g;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ guests, email });
    alert('回答を送信しました（コンソールを確認してください）');
  };

  return (
    <section id="rsvp" className="section rsvp">
      <h2 className="section-title">RSVP</h2>
      <div className="divider"></div>

      <form className="rsvp-form" onSubmit={handleSubmit}>
        {guests.map((guest, index) => (
          <div key={guest.id} className="guest-block">
            {/* 2人目以降の場合のみ削除ボタンを表示 */}
            {index > 0 && (
              <button
                type="button"
                className="remove-guest-btn"
                onClick={() => removeGuest(guest.id)}
                aria-label="ゲストを削除"
              >
                ×
              </button>
            )}
            <h3 className="form-section-title">
              {guest.type === 'adult' ? `大人 (${index + 1}人目)` : `お子様 (${index + 1}人目)`}
            </h3>

            {/* 出欠確認 */}
            <div className="form-group">
              <label className="required">ご出席確認</label>
              <div className="radio-group">
                <label>
                  <input type="radio" name={`att-${guest.id}`} value="attend" required
                    onChange={(e) => updateGuest(guest.id, 'attendance', e.target.value)} />
                  ご出席
                </label>
                <label>
                  <input type="radio" name={`att-${guest.id}`} value="decline" required
                    onChange={(e) => updateGuest(guest.id, 'attendance', e.target.value)} />
                  ご欠席
                </label>
              </div>
            </div>

            {guest.attendance && (
              <>
                {/* 共通：名前入力（欠席でも表示） */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="required">姓</label>
                    <input type="text" required value={guest.lastName}
                      onChange={(e) => updateGuest(guest.id, 'lastName', e.target.value)} placeholder="山田" />
                  </div>
                  <div className="form-group">
                    <label className="required">名</label>
                    <input type="text" required value={guest.firstName}
                      onChange={(e) => updateGuest(guest.id, 'firstName', e.target.value)} placeholder="太郎" />
                  </div>
                </div>

                {/* 出席の場合のみ表示する詳細項目 */}
                {guest.attendance === 'attend' && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="required">読み仮名（姓）</label>
                        <input type="text" required pattern="^[ぁ-ゞ]+$" title="ひらがなで入力してください"
                          value={guest.kanaLastName} onChange={(e) => updateGuest(guest.id, 'kanaLastName', e.target.value)} placeholder="やまだ" />
                      </div>
                      <div className="form-group">
                        <label className="required">読み仮名（名）</label>
                        <input type="text" required pattern="^[ぁ-ゞ]+$" title="ひらがなで入力してください"
                          value={guest.kanaFirstName} onChange={(e) => updateGuest(guest.id, 'kanaFirstName', e.target.value)} placeholder="たろう" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>スペル（姓）</label>
                        <input type="text" pattern="^[a-zA-Z]+$" title="アルファベットで入力してください"
                          value={guest.enLastName} onChange={(e) => updateGuest(guest.id, 'enLastName', e.target.value)} placeholder="YAMADA" />
                      </div>
                      <div className="form-group">
                        <label>ミドルネーム</label>
                        <input type="text" pattern="^[a-zA-Z\s]*$"
                          value={guest.enMiddleName} onChange={(e) => updateGuest(guest.id, 'enMiddleName', e.target.value)} placeholder="Optional" />
                      </div>
                      <div className="form-group">
                        <label>スペル（名）</label>
                        <input type="text" pattern="^[a-zA-Z]+$" title="アルファベットで入力してください"
                          value={guest.enFirstName} onChange={(e) => updateGuest(guest.id, 'enFirstName', e.target.value)} placeholder="TARO" />
                      </div>
                    </div>

                    {guest.type === 'adult' ? (
                      <>
                        <div className="form-group checkbox-group">
                          <label>
                            <input type="checkbox" checked={guest.isDriving} onChange={(e) => updateGuest(guest.id, 'isDriving', e.target.checked)} />
                            お車で来られますか？
                          </label>
                        </div>
                        {guest.isDriving && (
                          <div className="form-group">
                            <label className="required">到着時刻</label>
                            <input type="time" required value={guest.arrivalTime} onChange={(e) => updateGuest(guest.id, 'arrivalTime', e.target.value)} />
                          </div>
                        )}

                        <div className="form-group checkbox-group">
                          <label>
                            <input type="checkbox" checked={guest.hasAllergy} onChange={(e) => updateGuest(guest.id, 'hasAllergy', e.target.checked)} />
                            アレルギーはございますか？
                          </label>
                        </div>
                        {guest.hasAllergy && (
                          <div className="allergy-section">
                            {guest.allergyList.map((allergy, i) => (
                              <div key={i} className="allergy-item">
                                <input type="text" placeholder="例：海老" value={allergy.food}
                                  onChange={(e) => {
                                    const newList = [...guest.allergyList];
                                    newList[i].food = e.target.value;
                                    updateGuest(guest.id, 'allergyList', newList);
                                  }} />
                                <div className="allergy-options">
                                  <label><input type="checkbox" checked={allergy.noExtract}
                                    onChange={(e) => {
                                      const newList = [...guest.allergyList];
                                      newList[i].noExtract = e.target.checked;
                                      updateGuest(guest.id, 'allergyList', newList);
                                    }} /> エキスもNG</label>
                                  <label><input type="checkbox" checked={allergy.noHeat}
                                    onChange={(e) => {
                                      const newList = [...guest.allergyList];
                                      newList[i].noHeat = e.target.checked;
                                      updateGuest(guest.id, 'allergyList', newList);
                                    }} /> 加熱済みもNG</label>
                                </div>
                              </div>
                            ))}
                            <button type="button" className="add-btn-mini" onClick={() => {
                              updateGuest(guest.id, 'allergyList', [...guest.allergyList, { food: '', noExtract: false, noHeat: false }]);
                            }}>＋ 項目を追加</button>
                          </div>
                        )}

                        <div className="form-group checkbox-group dietary-main-checkbox">
                          <label>
                            <input type="checkbox" checked={guest.hasDietaryNeed}
                              onChange={(e) => updateGuest(guest.id, 'hasDietaryNeed', e.target.checked)} />
                            妊娠・授乳中など、その他の理由でお食事に配慮が必要ですか？
                          </label>
                        </div>
                        {guest.hasDietaryNeed && (
                          <div className="dietary-detail-section">
                            <div className="dietary-options-grid">
                              {['アルコールNG', '生魚NG', '肉はよく焼き（通常ですとミディアムレアになります）', 'チョコレートNG', 'カフェインNG', 'その他（自由入力）'].map(opt => (
                                <label key={opt} className="dietary-option-label">
                                  <input type="checkbox" checked={guest.dietaryOptions.includes(opt)} onChange={() => handleDietaryChange(guest.id, opt)} /> {opt}
                                </label>
                              ))}
                            </div>
                            {guest.dietaryOptions.includes('その他（自由入力）') && (
                              <div className="dietary-other-input">
                                <textarea className="rsvp-textarea" placeholder="詳細をご記入ください" value={guest.dietaryOtherText}
                                  onChange={(e) => updateGuest(guest.id, 'dietaryOtherText', e.target.value)} />
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="child-fields">
                        <div className="form-group">
                          <label className="required">ご年齢</label>
                          <input
                            type="text"
                            required
                            value={guest.childAge}
                            onChange={(e) => updateGuest(guest.id, 'childAge', e.target.value)}
                            placeholder="例: 3歳"
                          />
                        </div>

                        <div className="form-group">
                          <label className="required">披露宴でのお食事</label>
                          <div className="radio-group-vertical">
                            <label>
                              <input
                                type="radio"
                                name={`food-${guest.id}`}
                                required
                                onChange={() => updateGuest(guest.id, 'childMeal', 'お子様プレートあり')}
                              /> お子様プレートあり
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`food-${guest.id}`}
                                onChange={() => updateGuest(guest.id, 'childMeal', '不要（大人と取り分け・離乳食持参など）')}
                              /> 不要
                            </label>
                          </div>
                        </div>


                        <div className="form-group">
                          <label className="required">当日のお座席について</label>
                          <div className="radio-group-vertical">
                            {[
                              'ベビーカーのまま着席',
                              '子供用椅子（ベルトあり）',
                              '子供用椅子（ベルトなし）',
                            ].map((seat) => (
                              <label key={seat}>
                                <input
                                  type="radio"
                                  name={`seat-${guest.id}`}
                                  required
                                  onChange={() => updateGuest(guest.id, 'childSeat', seat)}
                                /> {seat}
                              </label>
                            ))}
                          </div>
                        </div>
                        {/* お子様用アレルギー項目 */}
                        <div className="form-group checkbox-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={guest.hasAllergy}
                              onChange={(e) => updateGuest(guest.id, 'hasAllergy', e.target.checked)}
                            />
                            アレルギーはございますか？
                          </label>
                        </div>
                        {guest.hasAllergy && (
                          <div className="allergy-section child-allergy">
                            {guest.allergyList.map((allergy, i) => (
                              <div key={i} className="allergy-item">
                                <input
                                  type="text"
                                  placeholder="例：卵、牛乳"
                                  value={allergy.food}
                                  onChange={(e) => {
                                    const newList = [...guest.allergyList];
                                    newList[i].food = e.target.value;
                                    updateGuest(guest.id, 'allergyList', newList);
                                  }}
                                />
                                <div className="allergy-options">
                                  <label><input type="checkbox" checked={allergy.noExtract}
                                    onChange={(e) => {
                                      const newList = [...guest.allergyList];
                                      newList[i].noExtract = e.target.checked;
                                      updateGuest(guest.id, 'allergyList', newList);
                                    }} /> エキスもNG</label>
                                  <label><input type="checkbox" checked={allergy.noHeat}
                                    onChange={(e) => {
                                      const newList = [...guest.allergyList];
                                      newList[i].noHeat = e.target.checked;
                                      updateGuest(guest.id, 'allergyList', newList);
                                    }} /> 加熱済みもNG</label>
                                </div>
                              </div>
                            ))}
                            <button type="button" className="add-btn-mini" onClick={() => {
                              updateGuest(guest.id, 'allergyList', [...guest.allergyList, { food: '', noExtract: false, noHeat: false }]);
                            }}>＋ 項目を追加</button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        ))}

        <div className="add-guest-buttons">
          <button type="button" className="add-btn" onClick={() => addGuest('adult')}>＋ 大人を追加</button>
          <button type="button" className="add-btn" onClick={() => addGuest('child')}>＋ お子様を追加</button>
        </div>

        <div className="form-footer-section">
          <div className="form-group">
            <label className="required">メールアドレス</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" className="rsvp-input" />
            <p className="help-text">回答完了のメールを送信するために使用します。</p>
          </div>
          <button type="submit" className="submit-btn">回答を送信する</button>
        </div>
      </form>
    </section>
  );
};

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
            <div className="content-column">
              <div className="schedule-header">
                <div className="schedule-image-container">
                  <img src="/ic_clink.png" alt="Welcome" className="schedule-icon-img" />
                </div>
                <span className="label">受付・ウェルカムドリンク</span>
              </div>
              <p className="schedule-detail">
                挙式までの時間をゆっくり過ごしていただけるよう、ささやかなお飲み物と軽食をご用意してお待ちしております。
              </p>
              <p className="schedule-detail">
                お早めに到着された方や、ゲスト同士のご歓談を楽しみたい方は、12:00-13:50の間のお好きな時間にお越しください。
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
            <div className="content-column">
              <div className="schedule-header">
                <div className="schedule-image-container">
                  <img src="/ic_ring.png" alt="Ceremony" className="schedule-icon-img" />
                </div>
                <span className="label">挙式</span>
              </div>
            </div>
          </div>

          {/* 14:30 撮影・歓談 */}
          <div className="schedule-item">
            <div className="time-column">
              <span className="time">14:30</span>
            </div>
            <div className="content-column">
              <div className="schedule-header">
                <div className="schedule-image-container">
                  <img src="/ic_camera.png" alt="Photo" className="schedule-icon-img" />
                </div>
                <span className="label">撮影・歓談</span>
              </div>
            </div>
          </div>

          {/* 15:30 披露宴 */}
          <div className="schedule-item">
            <div className="time-column">
              <span className="time">15:30</span>
            </div>
            <div className="content-column">
              <div className="schedule-header">
                <div className="schedule-image-container">
                  <img src="/ic_catrary.png" alt="Party" className="schedule-icon-img" />
                </div>
                <span className="label">披露宴</span>
              </div>
            </div>
          </div>

          {/* 17:30 お開き */}
          <div className="schedule-item">
            <div className="time-column">
              <span className="time">17:30</span>
            </div>
            <div className="content-column">
              <div className="schedule-header">
                <div className="schedule-image-container">
                  <img src="/ic_farewel.png" alt="Closing" className="schedule-icon-img" />
                </div>
                <span className="label">お開き</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dress-code-section">
          <div className="dress-icon-container">
            <img src="/ic_hanger.png" alt="Dress Code" className="dress-icon-img" />
          </div>
          <h3 className="dress-title">DRESS CODE</h3>
          <p className="dress-text">
            ウェディングドレス以外のお好きな格好でお越しください<br />
            普段着から一張羅までお好きな格好でお越しください
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.916689226235!2d139.6933241757865!3d35.654424172595874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b6fe1807495%3A0xc2ec7c17cd1e398a!2z44Ki44Oz44K444Kn44OR44OG44Kj44Kq44Km44Ko44OH44Kj44Oz44Kw!5e0!3m2!1sja!2sjp!4v1770297805500!5m2!1sja!2sjp"
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
      <RSVPForm />

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