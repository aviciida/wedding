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
  const [showModal, setShowModal] = useState(false); // モーダルの表示・非表示
  const [isAttending, setIsAttending] = useState(false); // 出席者がいるかどうか
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const AllergySection = ({ guest, updateGuest }) => {
    const handleAllergyChange = (index, field, value) => {
      const newList = [...guest.allergyList];
      newList[index][field] = value;
      updateGuest(guest.id, 'allergyList', newList);
    };

    const addAllergyItem = () => {
      updateGuest(guest.id, 'allergyList', [
        ...guest.allergyList,
        { food: '', noExtract: false, noHeat: false }
      ]);
    };

    return (
      <div className="allergy-container">
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
          <div className="allergy-section">
            {guest.allergyList.map((allergy, i) => (
              <div key={i} className="allergy-item">
                <input type="text" placeholder="例：海老" value={allergy.food}
                  required={i == 0 && guest.hasAllergy}
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
      </div>
    );
  };

  const [copyLabel, setCopyLabel] = useState("振込先をコピーする");

  const copyToClipboard = () => {
    const text = "〇〇銀行 〇〇支店 普通 1234567 カナメ ナマエ";
    navigator.clipboard.writeText(text).then(() => {
      setCopyLabel("コピーしました！ ✓");
      setTimeout(() => setCopyLabel("振込先をコピーする"), 2000); // 2秒で元に戻す
    });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  
  // ローディング開始 ★
  setIsSubmitting(true);
  
  const someOneAttending = guests.some(guest => guest.attendance === 'attend');
  setIsAttending(someOneAttending);
  
  // スプレッドシートに送信するデータを準備
  const dataToSend = guests.map(guest => ({
    type: guest.type === 'adult' ? '大人' : 'お子様',
    attendance: guest.attendance === 'attend' ? '出席' : '欠席',
    firstName: guest.firstName,
    lastName: guest.lastName,
    kanaFirstName: guest.kanaFirstName,
    kanaLastName: guest.kanaLastName,
    enFirstName: guest.enFirstName,
    enMiddleName: guest.enMiddleName,
    enLastName: guest.enLastName,
    isDriving: guest.isDriving ? 'はい' : 'いいえ',
    arrivalTime: guest.arrivalTime,
    hasAllergy: guest.hasAllergy ? 'はい' : 'いいえ',
    allergyList: guest.hasAllergy ? JSON.stringify(guest.allergyList, null, 2) : '',
    hasDietaryNeed: guest.hasDietaryNeed ? 'はい' : 'いいえ',
    dietaryOptions: guest.hasDietaryNeed ? guest.dietaryOptions.join(', ') : '',
    dietaryOtherText: guest.dietaryOtherText,
    childAge: guest.childAge,
    childMeal: guest.childMeal,
    childSeat: guest.childSeat,
    emailAdress: email
  }));

  // GASに送信
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyKMigFLf0zhpNiO5XlkwRCFYnmT4y4XPlJEntnAYTebUbDvgHp2hs1H0ES_mqcWEQCeQ/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend)
    });
    
  } catch (error) {
    console.error('❌ 送信エラー:', error);
    setIsSubmitting(false); // ★ エラー時はローディング終了
    alert('送信中にエラーが発生しました。もう一度お試しください。');
    return;
  }
  
  setIsSubmitting(false); // ★ 送信完了後ローディング終了
  setShowModal(true);
};

  return (
    <section id="rsvp" className="section rsvp">
      <h2 className="section-title">RSVP</h2>
      <div className="divider"></div>
            {/* RSVP Notice */}
      <section className="section rsvp-notice">
        <p className="rsvp-deadline">
          お手数ですが<br />下記お日にち迄に出欠情報のご連絡をお願い申し上げます<br />
        </p>

        <div className="rsvp-deadline-date-container">
          <span className="rsvp-deadline-date">2026年3月26日</span>
        </div>
        <p className="rsvp-note">
          期日までのご返信が難しい場合は、ご一報いただけますと幸いです。
        </p>
      </section>

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

                        {/* 共通コンポーネント呼び出し */}
                        <AllergySection guest={guest} updateGuest={updateGuest} />

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
                                  required={guest.dietaryOptions.includes("その他（自由入力）")}
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
                        {/* 共通コンポーネント呼び出し */}
                        <AllergySection guest={guest} updateGuest={updateGuest} />
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
          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                送信中
                <span className="spinner"></span>
              </>
            ) : (
              '回答を送信する'
            )}
          </button>
        </div>
      </form>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>お忙しい中ご出席のお返事を賜り<br />誠にありがとうございます</h3>
            <div class="mail-wrapper">
              <div class="envelope">
                <div class="lid"></div>
                <div class="letter">
                  <div class="text-line"></div>
                  <div class="text-line"></div>
                  <div class="text-line"></div>
                </div>
                <div class="envelope-front"></div>
              </div>
            </div>
            <p style={{ marginTop: '20px' }}>内容確認のメールを送付いたしました。</p>
            {isAttending ? (
              /* 出席者が1人でもいる場合 */
              <div className="modal-body">

                <p >メール内でもご案内しておりますが、<br />
                  当日のスムーズな受付のため、ご祝儀の事前振込をお願いしております。</p>
                <div className="bank-info-box">
                  <p className="bank-label">振込先案内</p>
                  <p className="bank-details">〇〇銀行 〇〇支店<br />普通 1234567 カナメ ナマエ</p>
                  <button onClick={copyToClipboard} className="btn-copy">
                    振込先をコピーする
                  </button>
                </div>

                <p>当日、お会いできるのを心より楽しみにしています！</p>
              </div>
            ) : (
              /* 全員欠席の場合 */
              <div className="modal-body">
                <p>今回はお会いできず非常に残念ですが、<br />今後とも末永いお付き合いをよろしくお願いいたします。</p>
              </div>
            )}
            <button onClick={() => setShowModal(false)} type="submit" className="submit-btn">閉じる</button>
          </div>
        </div>
      )}
    </section>
  );
};

const ImageCarousel = () => {
  const images = [
    'dresscode_reel_1.png',
    'dresscode_reel_2.png',
    'dresscode_reel_3.png',
    'dresscode_reel_4.png',
  ];

  // 無限ループを実現するために、リストを2回繰り返す
  const displayImages = [...images, ...images];

  return (
    <div className="carousel-viewport">
      <div className="carousel-track">
        {displayImages.map((src, index) => (
          <div className="carousel-slide" key={index}>
            <img src={src} alt={`Dresscode ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="wedding-site">
      <header className="header">
        <div className="header-inner">

          {/* ハンバーガーメニュー用のチェックボックス（非表示） */}
          <input type="checkbox" id="menu-toggle" className="menu-toggle" />

          {/* 三本線のアイコン */}
          <label htmlFor="menu-toggle" className="menu-icon">
            <span></span>
          </label>

          {/* Navigation */}
          <nav className="nav">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#greetings">Greetings</a></li>
              <li><a href="#information">Information</a></li>
              <li><a href="#access">Access</a></li>
              <li><a href="#rsvp">RSVP</a></li>
            </ul>
          </nav>
        </div>
      </header>



      {/* Home Section */}
      <section id="home" className="section hero">
        <h1 className="title">Halko & Ryo</h1>
        <p className="subtitle">are saying "I do"</p>

        <div className="photo-frame">
          <img
            src="img_dressed.png"
            alt="Halko & Ryo"
            className="couple-photo"
          />
        </div>

        <p className="date">2026.04.29</p>
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
        </div>
        <div className="signature-container">
          {/* 新婦様 */}
          <div className="signature-box">
            <img src="img_sign_halko.png" alt="春子 サイン" className="handwritten-sign" />
            <p className="name-text">春子</p>
          </div>

          {/* 新郎様 */}
          <div className="signature-box">
            <img src="img_sign_ryo.png" alt="諒 サイン" className="handwritten-sign" />
            <p className="name-text">諒</p>
          </div>
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
                挙式までの時間をゆっくり過ごしていただけるよう、ささやかなお飲み物と軽食をご用意しております。
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
          <h3 className="dress-title">Dress Code</h3>
          {/* <ImageCarousel/> */}
          <p className="dress-text">
            ウェディングドレス以外のお好きな格好でお越しください。<br />
            普段着から一張羅までお好きな格好でお越しください。
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

        <a
          href="https://www.angepatio.net/access"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-text-link"
        >
          最寄駅からのアクセス
          <span className="icon-arrow">→</span>
        </a>
      </section>
      <RSVPForm />

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