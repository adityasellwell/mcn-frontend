import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import { createApplication } from "../../services/applicationService";
import toast from "react-hot-toast";
import qrImage from "../../assets/images/qr.png";
import { getChapters } from "../../services/chapterService";
import { getUpcomingMeeting } from "../../services/meetingService";
import { Trash } from "lucide-react";

const Register = () => {
  usePageTitle("Register Yourself - MCN");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [registrationType, setRegistrationType] = useState("");
  const [chapters, setChapters] =useState([]);
  const [formData, setFormData] = useState({
    chapterId: "",
    fullName: "",
    mobile: "",
    email: "",
    companyName: "",
    businessCategory: "",
    website: "",
    socialLinks: [],
    address: "",
    referredBy: "",
    utrNumber: "",
    screenshot: null,
  });

  const [socialLinks, setSocialLinks] =
  useState([
    {
      platform: "",
      url: "",
    },
  ]);

  const addSocialLink = () => {
    setSocialLinks([
      ...socialLinks,
      {
        platform: "",
        url: "",
      },
    ]);
  };

  const removeSocialLink = (index) => {
  const updated = socialLinks.filter(
    (_, i) => i !== index
  );

  setSocialLinks(updated);
};

  const updateSocialLink = (
      index,
      field,
      value
    ) => {
      const updated = [...socialLinks];

      updated[index][field] = value;

      setSocialLinks(updated);
    };

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }
};
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      screenshot: e.target.files[0],
    }));
  };

  const handleChapterChange = async (e) => {
  const chapterId = e.target.value;

  setFormData((prev) => ({
    ...prev,
    chapterId,
  }));

  try {
    const response = await getUpcomingMeeting(chapterId);

    setSelectedMeeting(response.data);
  } catch (error) {
    console.error(error);
    setSelectedMeeting(null);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  setErrors({});
  setLoading(true);

  try {
    if (
      !formData.utrNumber &&
      !formData.screenshot
    ) {
      toast.error(
        "Please provide UTR Number or Payment Screenshot"
      );

      return;
    }

    const validationErrors = {};

    if (!registrationType) {
      validationErrors.registrationType =
        "Please select registration type";
    }

    if (!formData.fullName.trim()) {
        validationErrors.fullName =
          "Full Name is required";
      } else if (
        formData.fullName.trim().length < 4
      ) {
        validationErrors.fullName =
          "Full Name must be at least 4 characters";
      } else if (
        formData.fullName.trim().length > 50
      ) {
        validationErrors.fullName =
          "Full Name cannot exceed 50 characters";
      } else if (
        !/^[A-Za-z\s]+$/.test(
          formData.fullName.trim()
        )
      ) {
        validationErrors.fullName =
          "Full Name can only contain letters and spaces";
      }

    if (!formData.mobile.trim()) {
          validationErrors.mobile =
            "Mobile Number is required";
        } else if (
          !/^[6-9]\d{9}$/.test(
            formData.mobile
          )
        ) {
          validationErrors.mobile =
            "Enter valid 10 digit mobile number";
        }

    if (!formData.email.trim()) {
        validationErrors.email =
          "Email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.email
        )
      ) {
        validationErrors.email =
          "Enter a valid email address";
      }

    if (!formData.companyName.trim()) {
        validationErrors.companyName =
          "Company Name is required";
      } else if (
        formData.companyName.trim().length < 2
      ) {
        validationErrors.companyName =
          "Company Name must be at least 2 characters";
      }

    if (!formData.businessCategory.trim()) {
        validationErrors.businessCategory =
          "Business Category is required";
      } else if (
        formData.businessCategory.trim().length < 3
      ) {
        validationErrors.businessCategory =
          "Business Category must be at least 3 characters";
      }

    if (!formData.address.trim()) {
          validationErrors.address =
            "Address is required";
        } else if (
          formData.address.trim().length < 10
        ) {
          validationErrors.address =
            "Please enter a complete address";
        }

    if (
      Object.keys(validationErrors).length
    ) {
      setErrors(validationErrors);
      return;
    }

    const selectedChapter = chapters.find(
        (chapter) =>
          chapter.id === Number(formData.chapterId)
      );

     
    const payload = {
          registrationType,
          chapterName: selectedChapter?.name || null,
          chapterId: formData.chapterId,
          meetingId: selectedMeeting?.id || null,
          fullName: formData.fullName,
          mobile: formData.mobile,
          email: formData.email,
          companyName: formData.companyName,
          businessCategory: formData.businessCategory,
          website: formData.website || null,
          // ─── Filter out empty social links before sending ───
          socialProfiles: socialLinks.filter(
            (link) => link.platform && link.url
          ),
          address: formData.address,
          referredBy: registrationType === "VISITOR" ? formData.referredBy || null : null,
          utrNumber: formData.utrNumber || null,
          screenshot: formData.screenshot,
        };

        console.log("Payload socialProfiles:", payload.socialProfiles);
    const response =
      await createApplication(payload);

    toast.success(response.message);

    if (response.data.meeting) {
        setSelectedMeeting(response.data.meeting);
      }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // ─── Reset all form state ───
        setRegistrationType("");
        setSelectedMeeting(null);
        setSocialLinks([{ platform: "", url: "" }]); // ← add this line
        setFormData({
          chapterId: "",
          fullName: "",
          mobile: "",
          email: "",
          companyName: "",
          businessCategory: "",
          website: "",
          socialLinks: [],
          address: "",
          referredBy: "",
          utrNumber: "",
          screenshot: null,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
      "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const loadChapters = async () => {
    try {
      const response =
        await getChapters();

      setChapters(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  loadChapters();
}, []);

  return (
 
    <div
      className="
        w-full
        max-w-4xl
        p-8
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-900
      "
    >
      <h1
        className="
          text-3xl
          font-bold
          text-center
          text-white
        "
      >
        Register Yourself
      </h1>

      <p
        className="
          mt-3
          text-center
          text-white
        "
      >
        Complete your registration and submit your details.
      </p>

      <form
        onSubmit={handleSubmit}
        className="
          mt-8
          grid
          md:grid-cols-2
          gap-4
        "
      >
        {/* Register As */}

       <div className="md:col-span-2">

            <select
              className={`input ${
                errors.registrationType
                  ? "border-red-500"
                  : ""
              }`}
              value={registrationType}
              onChange={(e) =>
                setRegistrationType(e.target.value)
              }
            >
              <option value="">
                Register As *
              </option>

              <option value="MEMBER">
                Member
              </option>

              <option value="GUEST">
                Guest
              </option>

              <option value="VISITOR">
                Visitor
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>

            {errors.registrationType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.registrationType}
              </p>
            )}

          </div>

        {/* Existing Chapter */}
{/* 
        {registrationType === "MEMBER" && (
          <div className="md:col-span-2">
            <p className="mb-3 text-white font-medium">
              Existing Chapter?
            </p>

            <div className="flex gap-6">
              <label className="text-white flex items-center gap-2">
                <input
                  type="radio"
                  value="YES"
                  checked={hasChapter === "YES"}
                  onChange={(e) =>
                    setHasChapter(e.target.value)
                  }
                />
                Yes
              </label>

              <label className="text-white flex items-center gap-2">
                <input
                  type="radio"
                  value="NO"
                  checked={hasChapter === "NO"}
                  onChange={(e) =>
                    setHasChapter(e.target.value)
                  }
                />
                No
              </label>
            </div>
          </div>
        )} */}

        {/* Chapter Name */}

        {registrationType !== "GUEST" && (
            <div className="md:col-span-2">
              <select
                name="chapterId"
                value={formData.chapterId}
                onChange={handleChapterChange}
                className="input"
              >
                <option value="">
                  Select Chapter
                </option>

                {chapters.map((chapter) => (
                  <option
                    key={chapter.id}
                    value={chapter.id}
                  >
                    {chapter.name} • {chapter.city}
                  </option>
                ))}
              </select>
            </div>
          )}

        {/* Personal Details */}

        <div>
            <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  className={`input ${
                    errors.fullName
                      ? "border-red-500"
                      : ""
                  }`}
                  value={formData.fullName}
                  onChange={handleChange}
                />

                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

      <div>
          <div className="flex">
            <div className="px-4 flex items-center border border-r-0 border-zinc-700 rounded-l-xl bg-zinc-900 text-zinc-400">
              +91
            </div>

            <input
              type="text"
              name="mobile"
              maxLength={10}
              placeholder="9876543210"
              className={`input rounded-l-none ${
                errors.mobile ? "border-red-500" : ""
              }`}
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">
              {errors.mobile}
            </p>
          )}
        </div>

        <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              className={`input ${
                errors.email
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

        {/* Business Details */}

        <div>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name *"
              className={`input ${
                errors.companyName
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.companyName}
              onChange={handleChange}
            />

            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyName}
              </p>
            )}
          </div>

        <div>
            <input
              type="text"
              name="businessCategory"
              placeholder="Business Category *"
              className={`input ${
                errors.businessCategory
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.businessCategory}
              onChange={handleChange}
            />

            {errors.businessCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.businessCategory}
              </p>
            )}
          </div>


        <div>
          <input
            type="url"
            name="website"
            placeholder="Website (Optional)"
            className="input"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        {/* Social Profiles */}

       <div className="md:col-span-2">

          <label className="text-white block mb-3">
            Social Profiles
          </label>

          {socialLinks.map((item, index) => (

            <div
                  key={index}
                  className="
                    grid
                    md:grid-cols-[1fr_1fr_auto]
                    gap-3
                    mb-3
                  "
                >

              <select
                className="input"
                value={item.platform}
                onChange={(e) =>
                  updateSocialLink(
                    index,
                    "platform",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select Platform
                </option>

                <option value="LinkedIn">
                  LinkedIn
                </option>

                <option value="Instagram">
                  Instagram
                </option>

                <option value="Facebook">
                  Facebook
                </option>

                <option value="Twitter">
                  Twitter
                </option>

                <option value="YouTube">
                  YouTube
                </option>
              </select>

              <input
                type="text"
                placeholder="Profile URL"
                className="input"
                value={item.url}
                onChange={(e) =>
                  updateSocialLink(
                    index,
                    "url",
                    e.target.value
                  )
                }
              />

              <button
                  type="button"
                  onClick={() =>
                    removeSocialLink(index)
                  }
                  disabled={socialLinks.length === 1}
                  className="
                    px-3
                    py-2
                    rounded-lg
                    bg-red-600
                    hover:bg-red-700
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    text-white
                  "
                >
                  <Trash />
                </button>

            </div>
          ))}

          <button
            type="button"
            onClick={addSocialLink}
            className="
              px-4
              py-2
              rounded-lg
              bg-green-600
              hover:bg-green-700
              text-white
            "
          >
            + Add Social Profile
          </button>

        </div>

        {/* Address */}

        <div className="md:col-span-2">
            <textarea
              name="address"
              rows={3}
              placeholder="Full Address *"
              className={`input ${
                errors.address
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.address}
              onChange={handleChange}
            />

            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address}
              </p>
            )}
          </div>

        {/* Venue */}

        {selectedMeeting && (
          
          <div className="md:col-span-2 border border-green-700 rounded-xl p-5 bg-green-50">
            <h3 className="text-green-700 font-semibold">
              Upcoming Meeting
            </h3>
            <h4 className="text-slate-900 text-lg mt-2 font-medium">
              {selectedMeeting.title}
            </h4>
            {selectedMeeting.description && (
              <p className="text-slate-600 mt-1 text-sm italic">
                {selectedMeeting.description}
              </p>
            )}
            <p className="text-slate-700 mt-2">📍 {selectedMeeting.address}</p>
            <p className="text-slate-700">
              📅 {new Date(selectedMeeting.meetingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="text-slate-700">
              🕒 {selectedMeeting.startTime} - {selectedMeeting.endTime}
            </p>
            <p className="text-green-700 mt-2 font-medium">
              Registration Fee: ₹{selectedMeeting.meetingFee ? Number(selectedMeeting.meetingFee) : 1000}
            </p>
            {selectedMeeting.agenda && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <span className="text-green-800 text-xs font-semibold uppercase tracking-wider block">
                  Agenda:
                </span>
                <p className="text-slate-700 text-sm mt-1 whitespace-pre-line">
                  {selectedMeeting.agenda}
                </p>
              </div>
            )}
          </div>
        )}

        {/* {registrationType !== "GUEST" &&
              formData.chapterId && (
                <>
                  {selectedMeeting ? (
                    <div className="md:col-span-2 border border-green-700 rounded-xl p-5 bg-green-950/20">
                      <h3 className="text-green-400 font-semibold">
                        Upcoming Meeting
                      </h3>

                      <h4 className="text-white text-lg mt-2 font-medium">
                        {selectedMeeting.title}
                      </h4>

                      <p className="text-zinc-300 mt-3">
                        📍 {selectedMeeting.address}
                      </p>

                      <p className="text-zinc-300">
                        📅{" "}
                        {new Date(
                          selectedMeeting.meetingDate
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                      <p className="text-zinc-300">
                        🕒 {selectedMeeting.startTime} - {selectedMeeting.endTime}
                      </p>

                      {selectedMeeting.meetingFee && (
                        <p className="text-green-400 mt-2 font-medium">
                          Registration Fee ₹{selectedMeeting.meetingFee}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="md:col-span-2 border border-yellow-700 rounded-xl p-5 bg-yellow-950/20">
                      <h3 className="text-yellow-400 font-semibold">
                        Upcoming Meeting
                      </h3>

                      <p className="text-zinc-300 mt-2">
                        No upcoming meeting found for this chapter.
                      </p>
                    </div>
                  )}
                </>
              )} */}
        {/* Visitor Referral */}

        {registrationType === "VISITOR" && (
          <input
            type="text"
            name="referredBy"
            placeholder="Referred By (Optional)"
            className="input md:col-span-2"
            value={formData.referredBy}
            onChange={handleChange}
          />
        )}

        {/* Payment Section */}

        <div
            className="
              md:col-span-2
              border
              border-zinc-800
              rounded-2xl
              p-5
              bg-zinc-950
              text-center
            "
          >
            <h3 className="text-white font-semibold text-lg">
              Registration Fee
            </h3>

            <p className="text-green-500 text-3xl font-bold mt-2">
              ₹{selectedMeeting?.meetingFee ? Number(selectedMeeting.meetingFee) : 1000}
            </p>

            <p className="text-zinc-400 text-sm mt-2">
              Scan the QR code and complete your payment.
            </p>

            <div
              className="
                w-full
                max-w-md
                mx-auto
                mt-5
                rounded-xl
                overflow-hidden
              "
            >
             <img
                src={qrImage}
                alt="QR"
                className="w-64 h-64 object-contain mx-auto rounded-xl"
              />
            </div>
          </div>

        {/* Screenshot upload and UTR Section*/}


        <div className="md:col-span-2">
          <h4 className="text-white font-medium mb-3">
            Payment Proof
          </h4>

          <p className="text-zinc-400 text-sm mb-4">
            Upload Screenshot or Enter UTR Number (either one is required)
          </p>
        </div>

        <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
  
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="
              input
              text-white
              file:mr-4
              file:py-2
              file:px-4
              file:rounded-lg
              file:border-0
              file:bg-[#0C831F]
              file:text-white
            "
            onChange={handleFileChange}
          />

          <input
            type="text"
            name="utrNumber"
            placeholder="Enter UTR Number"
            className="input"
            value={formData.utrNumber}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}

        {/* <pre className="text-red-500">
          {JSON.stringify(errors, null, 2)}
        </pre> */}

       <button
            type="submit"
            disabled={loading}
            className="
              md:col-span-2
              py-3
              rounded-xl
              bg-[#0C831F]
              hover:bg-[#0A6F1A]
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition-all
              duration-300
              flex
              items-center
              justify-center
              gap-2
            "
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </button>

        {/* Login Link */}

        <div
          className="
            md:col-span-2
            text-center
            text-sm
            text-zinc-500
          "
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              text-[#22C55E]
              hover:underline
            "
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;